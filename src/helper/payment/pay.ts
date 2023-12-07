import { AccountItem, CarConfig } from '@/types/ui'
import dayjs from 'dayjs'
import mallcooFetcher from 'utils/wrapper-mallcoo'

interface DiscountCoreQueryParams extends AccountItem, CarConfig {
  uid: string
  plateNo: string
  loginForToken: string
  rightsRuleModelList: Record<string, any>[]
}

// 缴纳车费，n小时内免费的才可成功
export const fetchPayFeeV31: any = async (props: DiscountCoreQueryParams) => {
  const {
    uid,
    mallId,
    parkId,
    freeMin,
    freeAmount,
    projectType,
    plateNo,
    loginForToken,
    rightsRuleModelList
  } = props || {}

  const ruleList = rightsRuleModelList || []
  let RuleName = ''
  let rights: any = {}

  // 判断当前时间是否 晚上21 点 & 第二天凌晨3 点之间
  const now = dayjs()
  const isNight =
    now.isAfter(dayjs().set('hour', 21).set('minute', 0).set('second', 0)) &&
    now.isBefore(dayjs().set('hour', 3).set('minute', 0).set('second', 0))
  if (isNight) {
    const name = '商场停车券'
    RuleName = name
    const couponRights =
      ruleList.filter((item: any) => {
        return item.RuleName === name
      })[0] || {}
    const { RightsList } = couponRights
    rights =
      RightsList.filter((item: any) => {
        return item.RightsType === 1
      })[0] || {}
  } else {
    const name = '会员权益'
    RuleName = name
    const freeRights =
      ruleList.filter((item: any) => {
        return item.RuleName === '会员权益'
      })[0] || {}
    // 权益列表
    const { RightsList } = freeRights
    rights =
      RightsList.filter((item: any) => {
        return item.RightsType === 1
      })[0] || {}
  }

  const url = 'https://m.mallcoo.cn/api/park/ParkFee/PayFeeV31?_type=3'
  const { Amount, Minutes } = rights || {}

  const params = {
    MallID: mallId,
    ParkID: parkId,
    UID: uid, // 必填，用于支付停车费的用户id
    OpenId: '',
    MCOpenId: '',
    Barcode: '',
    FreeMinutes: freeMin || Minutes,
    FreeAmount: freeAmount || Amount,
    OrderPrice: 0,
    PlateNo: plateNo,
    ReturnUrl:
      'https:////m.mallcoo.cn/a/parking/11707/Order/PayResult?orderid=',
    Header: { Token: `${loginForToken},${projectType}` },
    RightsModelList: [
      {
        ...rights,
        RuleName
      }
    ]
  }

  const [, data] = await mallcooFetcher({
    url,
    method: 'POST',
    data: JSON.stringify(params),
    headers: {
      'Content-Type': 'application/json; charset=utf-8',
      cookie: `_mid=11707; _uuid=fb7528d8fa926c2cfca59810629c917a; _uid=${uid};`
    }
  })

  return data
}
