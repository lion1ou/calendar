import { STORAGE_KEY } from '@/config';

export const isArr = (data: any) => Object.prototype.toString.call(data) === '[object Array]';
export const isObj = (data: any) => Object.prototype.toString.call(data) === '[object Object]';
export const isDate = (data: any) => Object.prototype.toString.call(data) === '[object Date]';
export const isStr = (data: any) => data && typeof data === 'string';
export const isNum = (data: any) => data && typeof data === 'number';
export const isEmpty = (data: any) => !data || (isObj(data) && Object.keys(data).length === 0);

export const isUtools = window.navigator.userAgent.toLowerCase().indexOf('utools') !== -1;

// 补全
export const addZero = (num: number) => {
  const temp = num.toString();
  return temp.length === 1 ? `0${num}` : num;
};

export const getStorage = (key: string): any => {
  const storage = window.utools ? window.utools.dbStorage : window.localStorage;
  const originStore = storage.getItem(`${STORAGE_KEY}-${key}`);
  if (isEmpty(originStore)) {
    return null;
  }
  return JSON.parse(originStore);
};

export const setStorage = (key: string, data: any): void => {
  const storage = window.utools ? window.utools.dbStorage : window.localStorage;
  if (data && !isEmpty(data)) {
    storage.setItem(`${STORAGE_KEY}-${key}`, JSON.stringify(data));
  } else {
    console.error('保存失败，存入数据格式有误');
  }
};

export const getLocation = () =>
  new Promise((resolve, reject) => {
    if (window.navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        data => {
          resolve(data);
        },
        error => {
          let errorMsg = '';
          switch (error.code) {
            case error.PERMISSION_DENIED:
              errorMsg = '用户拒绝对获取地理位置的请求。';
              break;
            case error.POSITION_UNAVAILABLE:
              errorMsg = '位置信息是不可用的。';
              break;
            case error.TIMEOUT:
              errorMsg = '请求用户地理位置超时。';
              break;
            default:
              errorMsg = '未知错误。';
              break;
          }
          reject(errorMsg);
        }
      );
    } else {
      reject('该浏览器不支持获取地理位置。');
      console.log('该浏览器不支持获取地理位置。');
    }
  });

/**
 * 用于转换颜色数值
 * @param The hex value to convert. ('123456'. '#123456', ''123', '#123')
 * @param An alpha value to apply. (optional) ('0.5', '0.25')
 * @return An rgb or rgba value. ('rgb(11, 22, 33)'. 'rgba(11, 22, 33, 0.5)')
 */
export const hexToRgba = (hex: string, a: number) => {
  const removeHash = (hex: string) => (hex.charAt(0) === '#' ? hex.slice(1) : hex);

  const parseHex = (nakedHex: string) => {
    const isShort = nakedHex.length === 3 || nakedHex.length === 4;

    const twoDigitHexR = isShort
      ? `${nakedHex.slice(0, 1)}${nakedHex.slice(0, 1)}`
      : nakedHex.slice(0, 2);
    const twoDigitHexG = isShort
      ? `${nakedHex.slice(1, 2)}${nakedHex.slice(1, 2)}`
      : nakedHex.slice(2, 4);
    const twoDigitHexB = isShort
      ? `${nakedHex.slice(2, 3)}${nakedHex.slice(2, 3)}`
      : nakedHex.slice(4, 6);
    const twoDigitHexA =
      (isShort ? `${nakedHex.slice(3, 4)}${nakedHex.slice(3, 4)}` : nakedHex.slice(6, 8)) || 'ff';

    // const numericA = +((parseInt(a, 16) / 255).toFixed(2));

    return {
      r: twoDigitHexR,
      g: twoDigitHexG,
      b: twoDigitHexB,
      a: twoDigitHexA,
    };
  };

  const hexToDecimal = (hex: string) => parseInt(hex, 16);

  const hexesToDecimals = ({ r, g, b, a }: any) => ({
    r: hexToDecimal(r),
    g: hexToDecimal(g),
    b: hexToDecimal(b),
    a: +(hexToDecimal(a) / 255).toFixed(2),
  });

  const isNumeric = (n: number) => !isNaN(parseFloat(n.toString())) && isFinite(n); // eslint-disable-line no-restricted-globals, max-len

  const formatRgb = (decimalObject: any, parameterA: number) => {
    const { r, g, b, a: parsedA } = decimalObject;
    const a = isNumeric(parameterA) ? parameterA : parsedA;

    return `rgba(${r}, ${g}, ${b}, ${a})`;
  };

  const hashlessHex = removeHash(hex);
  const hexObject = parseHex(hashlessHex);
  const decimalObject = hexesToDecimals(hexObject);

  return formatRgb(decimalObject, a);
};
