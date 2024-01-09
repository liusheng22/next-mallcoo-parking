import { AccountItem, CarConfig } from '@/types/ui'
import mallcooFetcher from 'utils/wrapper-mallcoo'

interface DiscountCoreQueryParams extends AccountItem, CarConfig {
  uid: string
  plateNo: string
  loginForToken: string
  rights: any
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
    rights
  } = props || {}

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
    RightsModelList: [rights]
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
