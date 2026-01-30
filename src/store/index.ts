import { getTheme, setBaseInfo, setTheme } from '@/utils';
import { USER_CONFIG, DEFAULT_CITY } from '@/config';

export default {
  state() {
    return {
      userConfig: USER_CONFIG,
      curTheme: getTheme(USER_CONFIG),
      curCity: DEFAULT_CITY,
    };
  },
  mutations: {
    setUserConfig(state: any, props: any) {
      const res = { ...state.userConfig };
      console.log(res, props);
      for (const key in props) {
        const item = props[key];
        if (item !== null || item !== undefined) {
          res[key] = item;
        }
      }
      state.userConfig = res;
      state.curTheme = getTheme(res);
      setTheme(res);
      setBaseInfo(res);
    },
  },
  getters: {
    getUserConfig(state: any) {
      const result = { ...USER_CONFIG, ...state.userConfig };
      console.log(result);
      return result;
    },
    getCurTheme(state: any) {
      return state.curTheme;
    },
  },
};
