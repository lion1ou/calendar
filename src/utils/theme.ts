import { THEME_CONFIG, DARKMODE_CONFIG, UserConfigType } from '../config';
import { isUtools, hexToRgba } from './common';

// 设置主题相关
export const getTheme = (userConfig: UserConfigType) => {
  const { themeKey, darkMode } = userConfig;
  const currentTheme: any = THEME_CONFIG.find(i => i.themeKey === themeKey);
  const currentDark: any = DARKMODE_CONFIG.find(i => i.value === darkMode);
  return {
    ...currentTheme,
    darkMode: currentDark.value,
    darkModeName: currentDark.label,
  };
};

export const setTheme = (userConfig: UserConfigType) => {
  const { themeKey, darkMode } = userConfig;
  setMainColor(themeKey);
  if (darkMode === 'light') {
    setDarkMode(false);
    rmListener();
  } else if (darkMode === 'dark') {
    setDarkMode(true);
    rmListener();
  } else if (darkMode === 'system') {
    if (isUtools) {
      setDarkUtools();
    } else {
      setDarkListen();
    }
  }
};

export const setMainColor = (themeKey: string) => {
  const currentTheme: any = THEME_CONFIG.find(i => i.themeKey === themeKey)?.config;
  document.documentElement.style.setProperty('--main-color', `${currentTheme.mainColor}`);
  document.documentElement.style.setProperty(
    '--sub-main-color',
    currentTheme.subMainColor || hexToRgba(`${currentTheme.mainColor}`, 0.8)
  );
};

export const setDarkMode = (isDark: boolean) => {
  if (isDark) {
    document.documentElement.style.setProperty('--bg-color', `#18181c`);
    document.documentElement.style.setProperty('--text-color', '#cdcdcd');
    document.documentElement.style.setProperty('--white-color', '#dddddd');
    document.documentElement.style.setProperty('--shadow-color', 'rgba(255,255,255, 0.1)');
  } else {
    document.documentElement.style.setProperty('--bg-color', `#ffffff`);
    document.documentElement.style.setProperty('--text-color', '#2c2c2e');
    document.documentElement.style.setProperty('--white-color', '#ffffff');
    document.documentElement.style.setProperty('--shadow-color', 'rgba(0,0,0, 0.1)');
  }
};

// utools 暗黑模式

const setDarkUtools = () => {
  if (window.utools.isDarkColors()) {
    setDarkMode(true);
  } else {
    setDarkMode(false);
  }
};

// 暗黑模式  ------开始-----
const darkMedia = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)');
const lightMedia = window.matchMedia && window.matchMedia('(prefers-color-scheme: light)');

function darkModeHandle() {
  if (darkMedia.matches) {
    setDarkMode(true);
  } else {
    setDarkMode(false);
  }
}

export const setDarkListen = () => {
  darkModeHandle();
  darkMedia.addEventListener('change', darkModeHandle);
  lightMedia.addEventListener('change', darkModeHandle);
};

export const rmListener = () => {
  darkMedia.removeEventListener('change', darkModeHandle);
  lightMedia.removeEventListener('change', darkModeHandle);
};
// 暗黑模式  ------结束-----
