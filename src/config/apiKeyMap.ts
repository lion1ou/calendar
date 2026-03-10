/**
 * 存储前缀配置
 * 天气 API 密钥已迁移到服务端，通过 .env 管理
 */
export const apiKeyMap = {
  STORAGE_KEY: (import.meta.env.VITE_STORAGE_KEY as string) || 'toy-calendar',
};
