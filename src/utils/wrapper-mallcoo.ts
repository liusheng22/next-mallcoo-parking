import { fetcher } from '@/app/composables/use-fetcher'

// mallcoo接口请求的包装器
const mallcooFetcher = async (params: any) => {
  const { url } = params
  let res = {}
  try {
    res = await fetcher(params)
  } catch (error) {
    return [false, {}]
  }
  const { m, d } = res || ({} as any)
  console.log(`${url} 请求 =>`, res)
  if (m === 1) {
    return [true, d]
  } else {
    return [false, {}]
  }
}

export default mallcooFetcher
