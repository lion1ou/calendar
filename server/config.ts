import dotenv from 'dotenv';
import path from 'path';

dotenv.config({ path: path.resolve(__dirname, '..', '.env') });

export const config = {
  port: 5555,
  nodeEnv: process.env.NODE_ENV || 'development',

  gdWeatherKey: process.env.GD_WEATHER_KEY || '',
  hfWeatherKey: process.env.HF_WEATHER_KEY || '',
  xzWeatherKey: process.env.XZ_WEATHER_KEY || '',
  xzWeatherSecret: process.env.XZ_WEATHER_SECRET || '',
};

const weatherKeys = ['gdWeatherKey', 'hfWeatherKey', 'xzWeatherKey'] as const;
const hasAnyKey = weatherKeys.some((key) => !!config[key]);

if (!hasAnyKey) {
  console.warn('[config] 警告: 未配置任何天气 API 密钥，天气服务将不可用');
} else {
  for (const key of weatherKeys) {
    if (!config[key]) {
      console.warn(`[config] 提示: ${key} 未配置`);
    }
  }
}
