const http = require('http')

const get = (url, data) => {
  let str = ''
  for (const key in data) {
    if (Object.hasOwnProperty.call(data, key)) {
      const element = data[key]
      str += `${key}=${element}&`
    }
  }
  return new Promise((resolve, reject) => {
    http.get(`${url}?${str.slice(0, -1)}`, (res) => {
      const { statusCode } = res
      const contentType = res.headers['content-type']

      let error
      // 任何 2xx 状态码都表示成功的响应，但是这里只检查 200。
      if (statusCode !== 200) {
        error = new Error('请求失败\n' + `状态码: ${statusCode}`)
      } else if (!/^application\/json/.test(contentType)) {
        error = new Error('无效的 content-type.\n' + `期望的是 application/json 但接收到的是 ${contentType}`)
      }
      if (error) {
        // 消费响应的数据来释放内存。
        reject(error)
        return
      }
      res.setEncoding('utf8')
      let rawData = ''
      res.on('data', (chunk) => {
        rawData += chunk
      })
      res.on('end', () => {
        try {
          const parsedData = JSON.parse(rawData)
          resolve(parsedData)
        } catch (e) {
          reject(e.message)
          console.error(e.message)
        }
      })
    })
  })
}

window.utoolsApi = { get }
