import { isObject, isUndefined } from 'utils/data-type'

// export const fetcher = async (args: AxiosRequestConfig<any>) => {
export const fetcher = async (args: any) => {
  const { url, method, data } = args || {}
  if (!url) {
    return {}
  }

  let body = data
  if (method === 'POST') {
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
    // args.url = `${process.env.API_URL}${url}`
    args.url = `http://localhost:3000${url}`
  }

  // const response = await axios({
  //   headers: {
  //     Accept: 'application/vnd.dpexpo.v1+json' //设置请求头
  //   },
  //   ...args
  // })

  // 使用 fetch 进行请求
  const response = await fetch(args.url, {
    method: method || 'GET',
    headers: {
      // Accept: 'application/vnd.dpexpo.v1+json' //设置请求头
    },
    body,
    ...args
  }).then((res) => {
    return res.json()
  })

  // return response.data
  return response
}
