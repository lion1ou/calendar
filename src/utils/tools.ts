import { calendarjs } from './calendar.ts'
import  config from './config'
const { STORAGE_KEY } = config
export const getYearMonthDay = (time: string | number | Date): object => {
  const now: Date = time ? new Date(time) : new Date()
  const year: number = now.getFullYear() // 2021
  const month: number = now.getMonth() + 1 // 0 - 11
  const day: number = now.getDate()
  const hour: number = now.getHours()
  const minutes: number = now.getMinutes()
  const seconds: number = now.getSeconds()
  const week: number = now.getDay()
  const lunar: object = calendarjs.solar2lunar(year, month, day) // 农历信息
  const result = { year, month, day, week, lunar, hour: addZero(hour), minutes: addZero(minutes), seconds: addZero(seconds) }
  return result
}

export const addZero = (num: number) => {
  let temp = num.toString()
  return temp.length === 1 ? '0' + num : num
}

export const getLunar = (year: number | string, month: number | string, day: number | string) => {
  return calendarjs.solar2lunar(year, month, day)
}

export const getBaseInfo = () => {
  const originStore = localStorage.getItem(STORAGE_KEY+'-baseInfo')
  const result = originStore ? JSON.parse(originStore) : {}
  return result
}

export const setBaseInfo = (params: object) => {
  const originStore = getBaseInfo()
  const data = {...originStore, ...params}
  localStorage.setItem(STORAGE_KEY+'-baseInfo', JSON.stringify(data))
}

export const isUtools = window.navigator.userAgent.toLowerCase().indexOf('utools') !== -1


export const getJsonp = (options: object) => {
  return new Promise((resolve, reject) => {
    // 判断是否是第一次jsonp请求
    if (!window.jsonpNum) {
      window.jsonpNum = 1
    } else {
      window.jsonpNum++
    }

    let { url, data, timeout = 5000, cbkey = 'callback' } = options

    //保证每次请求接收的方法都不会重复
    let funName = 'jsonpReceive' + window.jsonpNum

    //清除本次jsonp请求产生的一些无用东西
    function clear() {
      window[funName] = null
      script.parentNode.removeChild(script)
      clearTimeout(timer)
    }

    //定义jsonp接收函数
    window[funName] = function (res) {
      //一旦函数执行了，就等于说请求成功了
      resolve(res)
      clear()
    }

    //请求超时计时器
    let timer = setTimeout(() => {
      reject('超时了')
      clear()
    }, timeout)

    //定义请求的参数
    let params = ''

    //如果有参数
    if (Object.keys(data).length) {
      for (let key in data) {
        params += `&${key}=${encodeURIComponent(data[key])}`
      }

      params = params.substr(1)
    }

    //拼接最终的请求路径，结尾拼接回调的方法名
    url = url + '?' + params + `&${cbkey}=${funName}`

    let script = document.createElement('script')
    script.src = url
    document.body.appendChild(script)
  })
}
