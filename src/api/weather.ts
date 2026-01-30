import CryptoJS from 'crypto-js';
import dayjs from 'dayjs';
import Request from './request';
import { apiKeyMap } from '../config';
import weatherImageCode from '../constant/WeatherImageCode';
import cityList from '../constant/CityAdCode2020';

/* ==========================================================================
   Tool Functions
   ========================================================================== */

function getSignatureParams(
  params: Record<string, any>,
  secretKey: string = apiKeyMap.xzWeatherSecret
): Record<string, any> {
  const newParams = { ...params };
  newParams.ts = Math.floor(new Date().getTime() / 1000); // 当前时间戳（秒）
  newParams.ttl = 300; // 过期时间

  // Construct parameter string for signature
  const keys = Object.keys(newParams);
  const str = keys.map(key => `${key}=${newParams[key]}`).join('&');

  const sig = CryptoJS.HmacSHA1(str, secretKey).toString(CryptoJS.enc.Base64);
  newParams.sig = sig;

  return newParams;
}

function params2UrlStr(params: Record<string, any>): string {
  return Object.keys(params)
    .map(key => `${key}=${encodeURIComponent(params[key])}`)
    .join('&');
}

const getWeatherCode = (text: string) => {
  const currentHour = new Date().getHours();
  if (text === '晴') {
    if (currentHour > 5 && currentHour < 18) {
      return 0;
    }
    return 1;
  }
  if (text === '晴间多云') {
    if (currentHour > 5 && currentHour < 18) {
      return 5;
    }
    return 6;
  }
  if (text === '大部多云') {
    if (currentHour > 5 && currentHour < 18) {
      return 7;
    }
    return 8;
  }
  return weatherImageCode[text] || 99;
};

/* ==========================================================================
   Type Definitions
   ========================================================================== */

export type WeatherInfo = {
  province: string;
  city: string;
  adCode: string;
  text: string;
  temp: string;
  windDir: string;
  windPower: string;
  humidity: string;
  code: string | number;
  whiteImg: string;
  blackImg: string;
  reportTime?: string;
  source?: 'hf' | 'gd' | 'xz';
};

/* ==========================================================================
   Service Logic
   ========================================================================== */

// HeFeng Weather Service
async function getHFNowWeather(city: string): Promise<WeatherInfo> {
  const host = 'https://devapi.qweather.com/v7/weather/now';

  // Helper to get location info first
  const getLocationInfo = async (cityName: string) => {
    const geoHost = 'https://geoapi.qweather.com/v2/city/lookup';
    const url = `${geoHost}?key=${apiKeyMap.hfWeatherKey}&location=${cityName}`;
    const data = await Request.get(url, {});

    if (data.code === '200' && data.location && data.location.length) {
      return data.location[0];
    }
    throw new Error('getLocationInfo 请求错误');
  };

  const locationInfo = await getLocationInfo(city);
  const paramsStr = params2UrlStr({
    key: apiKeyMap.hfWeatherKey,
    location: locationInfo?.id || '101010100',
  });
  const url = `${host}?${paramsStr}`;

  const data = await Request.get(url, {});

  if (data.code === '200') {
    const { now, updateTime } = data;
    if (now && updateTime && locationInfo) {
      return {
        province: locationInfo.adm1,
        city: locationInfo.name,
        adCode: city,
        text: now.text,
        temp: now.temp,
        windDir: now.windDir,
        windPower: now.windSpeed,
        humidity: now.humidity,
        code: getWeatherCode(now.text),
        whiteImg: `https://cdn.lion1ou.tech/weather/white/${getWeatherCode(now.text)}@2x.png`,
        blackImg: `https://cdn.lion1ou.tech/weather/black/${getWeatherCode(now.text)}@2x.png`,
        reportTime: dayjs(now.obsTime).format('YYYY-MM-DD HH:mm:ss'),
        source: 'hf',
      };
    }
    throw new Error('和风接口，返回为空');
  }
  throw new Error('和风接口，返回为空');
}

// XinZhi Weather Service
async function getXZNowWeather(cityInfo: any): Promise<WeatherInfo> {
  const url = 'https://api.seniverse.com/v3/weather/now.json';

  const params = {
    public_key: apiKeyMap.xzWeatherKey,
    location: cityInfo?.cityPy?.[0] || 'hangzhou',
    language: 'zh-Hans',
    unit: 'c',
  };

  const query = getSignatureParams(params, apiKeyMap.xzWeatherSecret);
  const fullUrl = `${url}?${params2UrlStr(query)}`;

  const data = await Request.get(fullUrl, {});

  if (data.results && data.results.length) {
    const dataList = data.results[0];

    return {
      province: dataList.location.province,
      city: dataList.location.name,
      adCode: cityInfo?.cityPy?.[0],
      text: dataList.now.text,
      temp: dataList.now.temperature,
      windDir: dataList.now.wind_direction || '-',
      windPower: dataList.now.wind_speed || '-',
      humidity: dataList.now.humidity || '-',
      code: getWeatherCode(dataList.now.text),
      whiteImg: `https://cdn.lion1ou.tech/weather/white/${getWeatherCode(
        dataList.now.text
      )}@2x.png`,
      blackImg: `https://cdn.lion1ou.tech/weather/black/${getWeatherCode(
        dataList.now.text
      )}@2x.png`,
      source: 'xz',
    };
  }

  throw new Error('心知接口请求错误');
}

// GaoDe Weather Service
async function getGDNowWeather(city: string): Promise<WeatherInfo> {
  const url = 'https://restapi.amap.com/v3/weather/weatherInfo';
  const params = {
    key: apiKeyMap.gdWeatherKey,
    city,
    extensions: 'base', // base:返回实况天气，all:返回预报天气
    output: 'JSON',
  };

  const fullUrl = `${url}?${params2UrlStr(params)}`;
  const data = await Request.get(fullUrl, {});

  if (data.status === '1' && data.infocode === '10000' && data.lives.length) {
    const dataList = data.lives[0];

    return {
      province: dataList.province,
      city: dataList.city,
      adCode: city,
      text: dataList.weather,
      temp: dataList.temperature,
      windDir: dataList.winddirection,
      windPower: dataList.windpower,
      humidity: dataList.humidity,
      code: getWeatherCode(dataList.weather),
      whiteImg: `https://cdn.lion1ou.tech/weather/white/${getWeatherCode(dataList.weather)}@2x.png`,
      blackImg: `https://cdn.lion1ou.tech/weather/black/${getWeatherCode(dataList.weather)}@2x.png`,
      reportTime: dataList.reporttime,
      source: 'gd',
    };
  }
  throw new Error('高德接口请求错误');
}

export const fetchNowWeather = async (city: string) => {
  if (!city) {
    throw new Error(`参数错误 city: ${city}`);
  }

  const cityInfo = cityList.find((item: any) => item.adCode === city);
  if (!cityInfo) {
    throw new Error(`城市${city}不存在`);
  }

  // Strategy: Try XinZhi -> HeFeng -> GaoDe
  try {
    return await getXZNowWeather(cityInfo);
  } catch (error) {
    console.error('XinZhi weather failed, trying HeFeng...', error);
    try {
      return await getHFNowWeather(city);
    } catch (error2) {
      console.error('HeFeng weather failed, trying GaoDe...', error2);
      try {
        return await getGDNowWeather(city);
      } catch (error3) {
        console.error('GaoDe weather failed, throw error...', error3);
        return null;
      }
    }
  }
};
