import { PayInfo } from '@/types/ui'
import mallcooFetcher from '@/utils/wrapper-mallcoo'

// 获取优惠券列表
export const fetchGetProIndexList: any = async (query: PayInfo) => {
  const { mallId, token, projectType } = query || {}
  const url = 'https://m.mallcoo.cn/api/hui/Promotion/GetProIndexList'

  const params = {
    MallID: mallId,
    Type: '2',
    pageIndex: 1,
    pageSize: 10,
    dataType: 0,
    orderField: 1,
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

// 领取优惠券
export const fetchReceiveCoupon: any = async (query: any) => {
  const { MallID, ID, Name, projectType, token } = query || {}
  // const { Token, ProjectType } = (await fetchLoginForThirdV2({
  //   openId,
  //   mallId: MallID
  // })) as MallcooData
  const url = 'https://m.mallcoo.cn/api/hui/Promotion/ReceiveCoupon'

  const params = {
    MallID: MallID,
    PromotionID: ID, // 优惠券ID
    RefIDList: 1259062,
    PromotionName: Name, // 优惠券Name
    Header: {
      Token: `${token},${projectType}`
      // Token: `${Token},${ProjectType}`
    }
  }

  const [, data] = await mallcooFetcher({
    url,
    method: 'POST',
    data: params
  })
  return data
}
