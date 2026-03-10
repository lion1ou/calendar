import { STORAGE_KEY, USER_CONFIG } from '@/config';

export const getBaseInfo = (param?: string) => {
  const storage = window.utools ? window.utools.dbStorage : window.localStorage;
  const originStore = storage.getItem(`${STORAGE_KEY}-BASE_INFO`);
  let result = originStore ? JSON.parse(originStore) : JSON.parse(JSON.stringify(USER_CONFIG));
  if (param) {
    result = result[param] === undefined ? USER_CONFIG[param] : result[param];
  }
  // console.log('getItem', JSON.stringify(result))
  return result;
};

export const setBaseInfo = (params: object) => {
  const storage = window.utools ? window.utools.dbStorage : window.localStorage;
  const originStore = getBaseInfo();
  const data = { ...originStore, ...params };
  storage.setItem(`${STORAGE_KEY}-BASE_INFO`, JSON.stringify(data));
  // console.log('setItem', JSON.stringify(data))
};

export * from './calendar';
export * from './common';
export * from './theme';
