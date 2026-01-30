// 用于存储用户相关配置
export interface UserConfigType {
  sideOpen: boolean;
  themeKey: string;
  darkMode: 'system' | 'dark' | 'light'; // system，dark，light
  weekStart: number;
}

export const DEFAULT_CITY = {
  adCode: '330106',
  countyName: '西湖区',
  cityCode: '0571',
  cityName: '杭州',
};

export const USER_CONFIG: UserConfigType = {
  sideOpen: true,
  themeKey: 'blue',
  darkMode: 'system', // system，dark，light
  weekStart: 0,
};

export const THEME_CONFIG = [
  {
    themeName: '默认蓝',
    themeKey: 'blue',
    config: {
      mainColor: '#1439f6',
      subMainColor: '#fc684c',
    },
  },
  {
    themeName: '森林绿',
    themeKey: '3e7c17',
    config: {
      mainColor: '#3e7c17',
      subMainColor: '',
    },
  },
  {
    themeName: '鲜橙红',
    themeKey: 'E84545',
    config: {
      mainColor: '#E84545',
      subMainColor: '',
    },
  },
  {
    themeName: '宝石绿',
    themeKey: 'C1F4C5',
    config: {
      mainColor: '#00C897',
      subMainColor: '',
    },
  },
  {
    themeName: '深天蓝',
    themeKey: '2FA4FF',
    config: {
      mainColor: '#2FA4FF',
      subMainColor: '',
    },
  },
  {
    themeName: '淡钢蓝',
    themeKey: '769FCD',
    config: {
      mainColor: '#769FCD',
      subMainColor: '',
    },
  },
  {
    themeName: '浅粉红',
    themeKey: 'F473B9',
    config: {
      mainColor: '#F473B9',
      subMainColor: '',
    },
  },
  {
    themeName: '海洋绿',
    themeKey: '94B49F',
    config: {
      mainColor: '#94B49F',
      subMainColor: '',
    },
  },
  {
    themeName: '兰花紫',
    themeKey: '6A2C70',
    config: {
      mainColor: '#6A2C70',
      subMainColor: '',
    },
  },
];

export const DARKMODE_CONFIG = [
  { label: '浅色', value: 'light' },
  { label: '深色', value: 'dark' },
  { label: '跟随系统', value: 'system' },
];
