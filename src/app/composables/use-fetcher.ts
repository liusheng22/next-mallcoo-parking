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

  console.log('process.env.NEXT_ENV =>', process.env.NEXT_ENV)
  console.log('process.env.NEXT_APP_API_URL =>', process.env.NEXT_APP_API_URL)
  console.log('process.env.API_URL =>', process.env.API_URL)

  // 如果 url 没有请求头，就加上
  if (!url.includes('http')) {
    // let isDev = false
    const prefix = 'https://mallcoo-parking.vercel.app/'
    // const prefix = 'https://mallcoo-parking.zeabur.app/'
    // const prefix = 'http://localhost:3000/'
    // try {
    //   // 判断是否是本地开发环境
    //   isDev = process.env.NEXT_ENV === 'development'
    //   if (isDev) {
    //     prefix = (process.env.NEXT_APP_API_URL || process.env.API_URL) as string
    //   }
    // } catch (error) {
    //   console.log('error =>', error)
    // }

    args.url = `${prefix}${url}`
  }

  // 使用 fetch 进行请求
  const response = await fetch(args.url, {
    method: args.method,
    body,
    headers: {
      referer: 'https://m.mallcoo.cn/',
      'user-agent':
        'Mozilla/5.0 (iPhone; CPU iPhone OS 11_3 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Mobile/15E217 MicroMessenger/6.8.0(0x16080000) NetType/WIFI Language/en Branch/Br_trunk MiniProgramEnv/Mac'
    },
    ...args
  })
    .then((res) => {
      // console.log(`${url} fetch res =>`, res)
      return res.json()
    })
    .catch((err) => {
      console.log('fetch err =>', err)
    })

  console.log(`${url} 结果 =>`, response)

  return response
}
