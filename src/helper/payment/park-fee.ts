import { PayInfo } from '@/types/ui'
import mallcooFetcher from 'utils/wrapper-mallcoo'

// 先获取停车信息，拿到 => ParkingMinutes PaidAmount
export const fetchGetParkFeeInit: any = async (query: PayInfo) => {
  const { uid, mallId, plateNo, parkId } = query
  const url = 'https://m.mallcoo.cn/api/park/ParkFee/GetParkFeeInit'

  const params = {
    UID: uid,
    PlateNo: plateNo,
    MallID: mallId,
    ParkID: parkId,
    Barcode: '',
    IsVerifyWaitPay: true,
    Header: {}
  }

  const [ok, data] = await mallcooFetcher({
    url,
    method: 'POST',
    data: params
  })
  console.log('fetchGetParkFeeInit data =>', data)
  if (!ok) {
    return {
      EntryTime: ''
    }
  }

  return data
}
