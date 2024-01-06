import { PayInfo } from '@/types/ui'
import mallcooFetcher from 'utils/wrapper-mallcoo'

// 先获取停车信息，拿到 => ParkingMinutes PaidAmount
export const fetchGetParkFeeInit: any = async (query: PayInfo) => {
  console.log('fetchGetParkFeeInit query =>', query)
  const { uid, mallId, plateNo, parkId } = query
  const url = 'https://m.mallcoo.cn/api/park/ParkFee/GetParkFeeInit'

  // const params = {
  //   UID: uid,
  //   PlateNo: plateNo,
  //   MallID: mallId,
  //   ParkID: parkId,
  //   Barcode: '',
  //   IsVerifyWaitPay: true
  // }

  const params = {
    UID: '167476415',
    MallID: 11707,
    ParkID: 985,
    PlateNo: '川F5N0S2',
    Barcode: '',
    IsVerifyWaitPay: true,
    UUID: '7a9e0ec5a90347ff8ce66415a97925bb',
    Header: {
      Token: 'QgHHpiWlXk-5-ICySehwQARYMAX9w_10,16706'
    }
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
