import axios from 'axios';
import { isUtools } from '@/utils';

export default class Request {
  private static async utoolsReq(method: 'post' | 'get', url: string, params: any) {
    const res = await window.utoolsApi[method](url, params);
    return res.data;
  }

  private static async axiosReq(method: 'post' | 'get', url: string, params: any) {
    const res = await axios({ method, url, data: params });
    return res.data;
  }

  private static async req(method: 'post' | 'get', url: string, params: any) {
    if (isUtools) {
      return this.utoolsReq(method, url, params);
    }
    return this.axiosReq(method, url, params);
  }

  public static post(url: string, params: any) {
    return this.req('post', url, params);
  }

  public static get(url: string, params: any) {
    return this.req('get', url, params);
  }
}

/**
 * 前端发起JSONP请求
 * @param options
 * @returns
 */
export const getJsonp = (options: object) =>
  new Promise((resolve, reject) => {
    // 判断是否是第一次jsonp请求
    if (!window.jsonpNum) {
      window.jsonpNum = 1;
    } else {
      window.jsonpNum++;
    }

    let { url, data, timeout = 5000, cbkey = 'callback' }: any = options;
    // 保证每次请求接收的方法都不会重复
    const funName = `jsonpReceive${window.jsonpNum}`;
    const script: any = document.createElement('script');

    // 清除本次jsonp请求产生的一些无用东西
    function clear() {
      (window as any)[funName] = null;
      script.parentNode.removeChild(script);
      clearTimeout(timer);
    }

    // 定义jsonp接收函数
    (window as any)[funName] = function (res: any) {
      // 一旦函数执行了，就等于说请求成功了
      resolve(res);
      clear();
    };

    // 请求超时计时器
    let timer = setTimeout(() => {
      reject('超时了');
      clear();
    }, timeout);

    // 定义请求的参数
    let params = '';

    // 如果有参数
    if (Object.keys(data).length) {
      for (const key in data) {
        params += `&${key}=${encodeURIComponent(data[key])}`;
      }
      params = params.substr(1);
    }

    // 拼接最终的请求路径，结尾拼接回调的方法名
    url = `${url}?${params}&${cbkey}=${funName}`;
    script.src = url;

    document.body.appendChild(script);
  });
