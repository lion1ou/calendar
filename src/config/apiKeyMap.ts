/**
 * API Key 与存储前缀配置
 * 敏感值通过环境变量注入，见项目根目录 .env.example
 */
export const apiKeyMap = {
  STORAGE_KEY: (import.meta.env.VITE_STORAGE_KEY as string) || 'toy-calendar',
  gdWeatherKey: (import.meta.env.VITE_GD_WEATHER_KEY as string) || '',
  hfWeatherKey: (import.meta.env.VITE_HF_WEATHER_KEY as string) || '',
  xzWeatherKey: (import.meta.env.VITE_XZ_WEATHER_KEY as string) || '',
  xzWeatherSecret: (import.meta.env.VITE_XZ_WEATHER_SECRET as string) || '',
};
