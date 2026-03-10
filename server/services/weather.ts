import CryptoJS from 'crypto-js';
import dayjs from 'dayjs';
import axios from 'axios';
import { config } from '../config';
import weatherImageCode from '../../src/constant/WeatherImageCode';
import cityListPart1 from '../../src/constant/CityAdCode2020_part1';
import cityListPart2 from '../../src/constant/CityAdCode2020_part2';

const cityList = [...cityListPart1, ...cityListPart2];

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
   Tool Functions
   ========================================================================== */

function getSignatureParams(
  params: Record<string, any>,
  secretKey: string = config.xzWeatherSecret,
): Record<string, any> {
  const newParams = { ...params };
  newParams.ts = Math.floor(Date.now() / 1000);
  newParams.ttl = 300;

  const str = Object.keys(newParams)
    .map((key) => `${key}=${newParams[key]}`)
    .join('&');

  newParams.sig = CryptoJS.HmacSHA1(str, secretKey).toString(CryptoJS.enc.Base64);
  return newParams;
}

function params2UrlStr(params: Record<string, any>): string {
  return Object.keys(params)
    .map((key) => `${key}=${encodeURIComponent(params[key])}`)
    .join('&');
}

function getWeatherCode(text: string): number {
  const currentHour = new Date().getHours();
  if (text === '晴') {
    return currentHour > 5 && currentHour < 18 ? 0 : 1;
  }
  if (text === '晴间多云') {
    return currentHour > 5 && currentHour < 18 ? 5 : 6;
  }
  if (text === '大部多云') {
    return currentHour > 5 && currentHour < 18 ? 7 : 8;
  }
  return weatherImageCode[text] || 99;
}

/* ==========================================================================
   Weather Service Implementations
   ========================================================================== */

async function getXZNowWeather(cityInfo: any): Promise<WeatherInfo> {
  const url = 'https://api.seniverse.com/v3/weather/now.json';

  const params = {
    public_key: config.xzWeatherKey,
    location: cityInfo?.cityPy?.[0] || 'hangzhou',
    language: 'zh-Hans',
    unit: 'c',
  };

  const query = getSignatureParams(params, config.xzWeatherSecret);
  const fullUrl = `${url}?${params2UrlStr(query)}`;

  const { data } = await axios.get(fullUrl);

  if (data.results && data.results.length) {
    const result = data.results[0];
    return {
      province: result.location.province,
      city: result.location.name,
      adCode: cityInfo?.cityPy?.[0],
      text: result.now.text,
      temp: result.now.temperature,
      windDir: result.now.wind_direction || '-',
      windPower: result.now.wind_speed || '-',
      humidity: result.now.humidity || '-',
      code: getWeatherCode(result.now.text),
      whiteImg: `https://cdn.lion1ou.tech/weather/white/${getWeatherCode(result.now.text)}@2x.png`,
      blackImg: `https://cdn.lion1ou.tech/weather/black/${getWeatherCode(result.now.text)}@2x.png`,
      source: 'xz',
    };
  }

  throw new Error('心知接口请求错误');
}

async function getHFNowWeather(city: string): Promise<WeatherInfo> {
  const geoHost = 'https://geoapi.qweather.com/v2/city/lookup';
  const geoUrl = `${geoHost}?key=${config.hfWeatherKey}&location=${city}`;
  const { data: geoData } = await axios.get(geoUrl);

  if (geoData.code !== '200' || !geoData.location?.length) {
    throw new Error('和风地理信息请求错误');
  }

  const locationInfo = geoData.location[0];
  const host = 'https://devapi.qweather.com/v7/weather/now';
  const paramsStr = params2UrlStr({
    key: config.hfWeatherKey,
    location: locationInfo.id || '101010100',
  });
  const { data } = await axios.get(`${host}?${paramsStr}`);

  if (data.code === '200' && data.now && data.updateTime && locationInfo) {
    const { now } = data;
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
  throw new Error('和风接口请求错误');
}

async function getGDNowWeather(city: string): Promise<WeatherInfo> {
  const url = 'https://restapi.amap.com/v3/weather/weatherInfo';
  const params = {
    key: config.gdWeatherKey,
    city,
    extensions: 'base',
    output: 'JSON',
  };

  const { data } = await axios.get(`${url}?${params2UrlStr(params)}`);

  if (data.status === '1' && data.infocode === '10000' && data.lives?.length) {
    const result = data.lives[0];
    return {
      province: result.province,
      city: result.city,
      adCode: city,
      text: result.weather,
      temp: result.temperature,
      windDir: result.winddirection,
      windPower: result.windpower,
      humidity: result.humidity,
      code: getWeatherCode(result.weather),
      whiteImg: `https://cdn.lion1ou.tech/weather/white/${getWeatherCode(result.weather)}@2x.png`,
      blackImg: `https://cdn.lion1ou.tech/weather/black/${getWeatherCode(result.weather)}@2x.png`,
      reportTime: result.reporttime,
      source: 'gd',
    };
  }
  throw new Error('高德接口请求错误');
}

/* ==========================================================================
   Cache
   ========================================================================== */

const cache = new Map<string, { data: WeatherInfo; timestamp: number }>();
const CACHE_TTL = 10 * 60 * 1000; // 10 minutes

function getCached(city: string): WeatherInfo | null {
  const entry = cache.get(city);
  if (entry && Date.now() - entry.timestamp < CACHE_TTL) {
    return entry.data;
  }
  cache.delete(city);
  return null;
}

function setCache(city: string, data: WeatherInfo): void {
  cache.set(city, { data, timestamp: Date.now() });
}

/* ==========================================================================
   Public API
   ========================================================================== */

export function getCityInfo(adCode: string) {
  return cityList.find((item: any) => item.adCode === adCode);
}

export async function fetchNowWeather(city: string): Promise<WeatherInfo | null> {
  if (!city) {
    throw new Error(`参数错误 city: ${city}`);
  }

  const cityInfo = getCityInfo(city);
  if (!cityInfo) {
    throw new Error(`城市 ${city} 不存在`);
  }

  const cached = getCached(city);
  if (cached) {
    return cached;
  }

  // Strategy: Try XinZhi -> HeFeng -> GaoDe
  let result: WeatherInfo | null = null;

  try {
    result = await getXZNowWeather(cityInfo);
  } catch (error) {
    console.error('XinZhi weather failed, trying HeFeng...', (error as Error).message);
    try {
      result = await getHFNowWeather(city);
    } catch (error2) {
      console.error('HeFeng weather failed, trying GaoDe...', (error2 as Error).message);
      try {
        result = await getGDNowWeather(city);
      } catch (error3) {
        console.error('All weather services failed', (error3 as Error).message);
        return null;
      }
    }
  }

  if (result) {
    setCache(city, result);
  }

  return result;
}
