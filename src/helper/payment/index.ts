import { MallcooData, PaymentParams } from '@/types/mallcoo'
import { AccountItem } from '@/types/ui'
import { fetcher } from 'app/composables/use-fetcher'
import { jsonBinDb } from 'utils/db'
import { sendFailNotify, sendSuccessNotify } from '../notify'
import { rightsFilter } from '../rights-filter'
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

  // 查询并领取优惠券
  const url = `/api/mallcoo/hui?mallId=${mallId}&plateNo=${plateNo}&openId=${openId}`
  await fetcher({ url })

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

  console.log('所有优惠列表 =>', rightsRuleModelList)
  const rights = rightsFilter(rightsRuleModelList as any[], false)
  console.log('优惠信息 =>', rights)
  if (!rights || !rights.RightsID) {
    payResMsg = '没有可用的优惠信息'
    sendFailNotify({
      PayTimes: index + 1,
      ...parkingInfo,
      Remark: payResMsg
    })
    return [false, { payResMsg }]
  }

  // DEBUG: 打印支付信息
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
    rights
  })

  console.log('实际支付结果 =>', payResult)

  const { OrderID } = payResult || {}
  if (OrderID) {
    console.log('支付成功🎉')
    if (accountTotal) {
      console.log(
        `${plateNo}：第${index + 1}个账号支付成功，剩余${
          accountTotal - index - 1
        }个账号`
      )

      sendSuccessNotify({
        PayTimes: index + 1,
        ...parkingInfo
      })

      // 清空支付账号信息
      if (accountTotal - index - 1 === 0) {
        console.log('所有账号支付完成，清空缓存')
        jsonBinDb.delete(`.usingAccount.${plateNo}`)
      }
    } else {
      sendSuccessNotify({
        PayTimes: index + 1,
        ...parkingInfo
      })

      // 更新该支付账号的信息
      const currentMallAccountList: AccountItem[] =
        (await jsonBinDb.getObjectDefault(`.mallWithAccount.${mallId}.list`)) ||
        []
      const paidIndex = currentMallAccountList.findIndex(
        (item) => item.openId === openId
      )
      await jsonBinDb.push(
        `.mallWithAccount.${mallId}.list[${paidIndex}].isPaid`,
        true,
        true
      )
    }

    return [true, payResult]
  } else {
    payResMsg = '支付结果失败'
    sendFailNotify({
      PayTimes: index + 1,
      ...parkingInfo,
      Remark: payResMsg
    })
    return [false, { payResMsg }]
  }
}

export default payment
