import { PayInfo } from '@/types/ui'
import mallcooFetcher from 'utils/wrapper-mallcoo'

// 先获取停车信息，拿到 => ParkingMinutes PaidAmount
export const fetchGetParkFeeInit: any = async (query: PayInfo) => {
  console.log('fetchGetParkFeeInit query =>', query)
  const { uid, mallId, plateNo, parkId } = query
  const url = 'https://m.mallcoo.cn/api/park/ParkFee/GetParkFeeInit'

  const params = {
    UID: uid,
    PlateNo: plateNo,
    MallID: mallId,
    ParkID: parkId,
    Barcode: '',
    IsVerifyWaitPay: true
  }
  console.log('fetchGetParkFeeInit params =>', params)

  const [ok, data] = await mallcooFetcher({
    url,
    method: 'POST',
    data: JSON.stringify(params)
  })
  console.log('fetchGetParkFeeInit data =>', data)
  if (!ok) {
    return {}
  }

  return data
}
