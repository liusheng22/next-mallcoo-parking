import { PayInfo } from '@/types/ui'
import mallcooFetcher from '@/utils/wrapper-mallcoo'

// 获取已领取的优惠券列表
export const fetchGetNotAboutToExpireCoupon: (
  query: PayInfo
) => Promise<any> = async (query) => {
  const { mallId, projectType, token } = query || {}
  const url =
    'https://m.mallcoo.cn/a/coupon/API/mycoupon/GetNotAboutToExpireCoupon'

  const params = {
    MinID: 0,
    PageSize: 10,
    MallID: mallId,
    Header: {
      Token: `${token},${projectType}`
    }
  }

  const [ok, data] = await mallcooFetcher({
    url,
    method: 'POST',
    data: params
  })

  if (!ok) {
    return []
  }
  return data
}
