import { PayInfo } from '@/types/ui'
import mallcooFetcher from 'utils/wrapper-mallcoo'

interface DiscountCoreQueryParams {
  token: string
  needPayAmount: number
  parkingMinutes: number
  plateNo: string
}

// 先获取停车信息，拿到RightsID(免费支付的时候需要)
export const fetchDiscountCoreQuery: any = async (
  props: DiscountCoreQueryParams & PayInfo
) => {
  const {
    mallId,
    parkId,
    projectType,
    token,
    needPayAmount,
    parkingMinutes,
    plateNo
  } = props || {}
  const url = 'https://m.mallcoo.cn/api/discount/DiscountCore/Query'

  const ExtendFields = {
    PlateNo: plateNo,
    Barcode: '',
    FeeId: '',
    UUID: '',
    HasFirstDis: false
  }

  const params = {
    MallID: mallId,
    BusiType: 0,
    BusiID: parkId,
    NeedPayAmount: needPayAmount,
    ParkingMinutes: parkingMinutes,
    ExtendFields: JSON.stringify(ExtendFields),
    Header: {
      Token: `${token},${projectType}`
    }
  }

  const [, data] = await mallcooFetcher({
    url,
    method: 'POST',
    data: params
  })

  return data
}
