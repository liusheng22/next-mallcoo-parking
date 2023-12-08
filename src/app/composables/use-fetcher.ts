import { isObject, isUndefined } from 'utils/data-type'

interface FetchRequest extends RequestInit {
  url: string
  data?: any
}

export const fetcher = async (args: FetchRequest) => {
  const { url, data } = args || {}
  if (!url) {
    return {}
  }

  if (!args.method) {
    args.method = 'GET'
  }

  console.log(`${url} 参数 =>`, data)

  let body = data
  if (['POST', 'PUT'].includes(args.method)) {
    args.headers = {
      'Content-Type': 'application/json'
    }
    if (isUndefined(data)) {
      body = null
    }
    if (isObject(data)) {
      body = JSON.stringify(data)
    }
  }

  // 如果 url 没有请求头，就加上
  if (!url.includes('http')) {
    const prefix = process.env.NEXT_APP_API_URL || process.env.API_URL

    args.url = `${prefix}${url}`
    // args.url = `http://localhost:3000${url}`
  }

  // 使用 fetch 进行请求
  const response = await fetch(args.url, {
    method: args.method,
    headers: {},
    body,
    ...args
  }).then((res) => {
    return res.json()
  })

  console.log(`${url} 结果 =>`, response)

  return response
}
