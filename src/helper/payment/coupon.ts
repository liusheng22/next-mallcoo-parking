import mallcooFetcher from '@/utils/wrapper-mallcoo'

// 获取已领取的优惠券列表
export const fetchGetNotAboutToExpireCoupon: any = async (uid: string, plateNo: string) => {
  const url = 'https://m.mallcoo.cn/a/coupon/API/mycoupon/GetNotAboutToExpireCoupon'

  const params = {
    MinID: 0,
    PageSize: 10,
    MallID: 11707,
    Header: {
      Token: '4LccDiWtH0y3xXTDddprVA0Rj5rxObr0,16706'
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
