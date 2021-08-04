import { getJsonp, isUtools } from './tools'
import config from './config'
import CryptoJS from 'crypto-js'

const { XZ_UID, XZ_KEY } = config
const URL = 'http://api.seniverse.com/v3'

export const getSignatureParams = () => {
  const ts = Math.floor(new Date().getTime() / 1000) // 当前时间戳（秒）
  const uid = XZ_UID // 用户ID

  // 使用 HMAC-SHA1 方式，以 API 密钥（key）对上一步生成的参数字符串进行加密
  // 将加密结果用 base64 编码，并做一个 urlencode，得到签名 sig
  const str = `ts=${ts}&uid=${uid}`
  const sig = CryptoJS.HmacSHA1(str, XZ_KEY).toString(CryptoJS.enc.Base64)

  return { ts, uid, sig }
}

const getWeatherApi = async (url: string, params: object) => {
  const sig = await getSignatureParams()
  if (isUtools) {
    return await window.utoolsApi.get(url, { ...params, ...sig })
  } else {
    return await getJsonp({ url, data: { ...params, ...sig } })
  }
}

export const getWeatherDaily = async (location = 'hangzhou') => {
  // 'http://api.seniverse.com/v3/weather/daily.json?key=WWLXWJGTJL&location=hangzhou&language=zh-Hans&unit=c&start=0&days=1'
  const params = {
    location,
    language: 'zh-Hans',
    unit: 'c',
    start: 0,
    days: 1
  }
  try {
    let res = await getWeatherApi(URL + '/weather/daily.json', params)
    if (res.results && res.results.length) {
      return res
    }
  } catch (error) {
    throw new Error(error)
  }
}
