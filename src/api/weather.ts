import Request from './request';

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

export const fetchNowWeather = async (city: string): Promise<WeatherInfo | null> => {
  if (!city) {
    throw new Error(`参数错误 city: ${city}`);
  }

  try {
    const data = await Request.post('/cApi/weather', { city });

    if (data.code === 0 && data.data) {
      return data.data as WeatherInfo;
    }
    console.error('[weather] proxy response error:', data);
    return null;
  } catch (error) {
    console.error('[weather] proxy request failed:', error);
    return null;
  }
};
