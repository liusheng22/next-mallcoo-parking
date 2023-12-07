import { MallcooData, PaymentParams } from '@/types/mallcoo'
import { localDb } from 'utils/db'
import { fetchDiscountCoreQuery } from './discount'
import { fetchLoginForThirdV2 } from './login'
import { fetchGetParkFeeInit } from './park-fee'
import { fetchPayFeeV31 } from './pay'

const payment: (params: PaymentParams) => Promise<any> = async (params) => {
  let payResMsg = ''
  const {
    index,
    accountTotal,
    openId,
    uid,
    mallId,
    parkId,
    projectType,
    freeMin,
    freeAmount,
    plateNo
  } = params
  if (!uid || !openId) {
    payResMsg = '没有可用的用户'
    return [false, { payResMsg }]
  }

  // 获取 Token
  const { Token: loginForToken } = (await fetchLoginForThirdV2({
    openId,
    mallId
  })) as MallcooData

  // 获取停车信息
  const parkFeeData: MallcooData = await fetchGetParkFeeInit({
    uid,
    mallId,
    plateNo,
    parkId
  })
  const { NeedPayAmount, ParkingMinutes, ParkName, EntryTime } =
    parkFeeData || {}

  // 获取优惠信息
  const discountData: MallcooData = await fetchDiscountCoreQuery({
    plateNo,
    parkId,
    projectType,
    mallId,
    token: loginForToken,
    needPayAmount: NeedPayAmount,
    parkingMinutes: ParkingMinutes
  })
  const { RightsRuleModelList: rightsRuleModelList } = discountData || {}

  const parkingInfo = {
    PlateNo: plateNo, // 车牌号
    ParkingMinutes, // 停车时长
    ParkName, // 停车场名称
    EntryTime // 入场时间
  }

  console.log('parkingInfo =>', parkingInfo)
  if (rightsRuleModelList && rightsRuleModelList.length) {
    // return [
    //   true,
    //   {
    //     uid,
    //     plateNo,
    //     loginForToken,
    //     rightsRuleModelList
    //   }
    // ]

    const payResult: MallcooData = await fetchPayFeeV31({
      uid,
      mallId,
      parkId,
      plateNo,
      freeMin,
      freeAmount,
      projectType,
      loginForToken,
      rightsRuleModelList
    })

    console.log('实际支付结果 =>', payResult)

    // payFail(parkingInfo, payResMsg)

    const { OrderID } = payResult || {}
    if (OrderID) {
      console.log('支付成功🎉')
      console.log(
        `${plateNo}：第${index + 1}个账号支付成功，剩余${
          accountTotal - index - 1
        }个账号`
      )

      // TODO: 清空支付账号信息
      localDb.delete(`.usingAccount.${plateNo}`)

      // sendSuccessNotify({
      //   PayTimes: useAccountIndex + 1,
      //   ...parkingInfo
      // })
      return [true, payResult]
    } else {
      payResMsg = '支付结果失败'
      // payFail(parkingInfo, payResMsg)
      return [false, { payResMsg }]
    }
  } else {
    payResMsg = '支付信息获取失败'
    // payFail(parkingInfo, payResMsg)
    return [false, { payResMsg }]
  }
}

export default payment
