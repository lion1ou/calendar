import { getJsonp } from './tools'
import config from './config'
var crypto = require('crypto')

const { uid, secretKey } = config
const URL = 'http://api.seniverse.com/v3'
const baseApi = {
  getWeatherApi: (params) => {
    console.log('getBaseApi', params)
    const { uid, url, ...data } = params
    return getJsonp({ url, data })
  }
}
console.log(window.utoolsApi)
const api = window.utoolsApi ? new window.utoolsApi() : baseApi

export const getSignatureParams = (uid, key) => {
  var params = {}
  params.ts = Math.floor(new Date().getTime() / 1000) // 当前时间戳（秒）
  params.ttl = 3000 // 过期时间
  params.uid = uid // 用户ID
  Object.keys(params).forEach((key) => {
    str += `${key}=${params.key}&`
  })
  var str = encodeURIComponent(str.substring(0, str.length - 1)) // 构造请求字符串
  // 使用 HMAC-SHA1 方式，以 API 密钥（key）对上一步生成的参数字符串进行加密
  params.sig = crypto.createHmac('sha1', key).update(str).digest('base64') // 将加密结果用 base64 编码，并做一个 urlencode，得到签名 sig

  return params
}

export const getWeatherDaily = async () => {
  // 'http://api.seniverse.com/v3/weather/daily.json?key=WWLXWJGTJL&location=hangzhou&language=zh-Hans&unit=c&start=0&days=1'
  const params = {
    uid,
    key: secretKey,
    url: URL + '/weather/daily.json',
    location: 'hangzhou',
    language: 'zh-Hans',
    unit: 'c',
    start: 0,
    days: 1
  }
  const sig = await = 
  try {
    let res = await api.getWeatherApi(params)
    console.log(params, res)
    if (res.results && res.results.length) {
      return res
    }
  } catch (error) {
    throw new Error(error)
  }
}
