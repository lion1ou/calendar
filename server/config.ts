import dotenv from 'dotenv';
import path from 'path';

dotenv.config({ path: path.resolve(__dirname, '..', '.env') });

export const config = {
  port: parseInt(process.env.SERVER_PORT || '5555', 10),
  nodeEnv: process.env.NODE_ENV || 'development',

  gdWeatherKey: process.env.GD_WEATHER_KEY || '',
  hfWeatherKey: process.env.HF_WEATHER_KEY || '',
  xzWeatherKey: process.env.XZ_WEATHER_KEY || '',
  xzWeatherSecret: process.env.XZ_WEATHER_SECRET || '',
};

const requiredKeys = ['gdWeatherKey', 'hfWeatherKey', 'xzWeatherKey', 'xzWeatherSecret'] as const;

for (const key of requiredKeys) {
  if (!config[key]) {
    console.warn(`[config] 警告: ${key} 未配置，相关天气服务将不可用`);
  }
}
