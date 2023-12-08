import { fetchGetParkFeeInit } from '@/helper/payment/park-fee'
import { success } from '@/helper/response'
import { AccountItem } from '@/types/ui'
import dayjs from 'dayjs'
import { NextRequest, NextResponse } from 'next/server'
import { getQuery } from 'utils/api-route'
import { db, localDb } from 'utils/db'

export async function GET(req: NextRequest) {
  const { uid, plateNo, mallId, parkId } = getQuery(req)

  // 查询待缴费信息，根据 EntryTime 判断是否车辆在场
  const data = await fetchGetParkFeeInit({
    uid,
    plateNo,
    mallId,
    parkId
  })
  const { EntryTime } = data || {}
  // 是否有待缴费
  let isWaitPay = false
  // dayjs 判断是否为有效时间
  if (EntryTime && dayjs(EntryTime).isValid()) {
    isWaitPay = true
  } else {
    // 无待缴费的车辆信息，清空 db 中的车辆信息
    const paymentAccountList = (await db.getObjectDefault(
      `.usingAccount.${plateNo}.list`,
      []
    )) as AccountItem[]
    // 未使用的账号
    const unUsedOpenIdList = paymentAccountList
      .filter((item: AccountItem) => !item.isPaid)
      .map((item: AccountItem) => item.openId)
    // 反哺到原始数据
    const accountList: AccountItem[] =
      (await db.getObjectDefault(`.mallWithAccount.${mallId}.list`)) || []
    const list = accountList.map((item: AccountItem) => {
      if (unUsedOpenIdList.includes(item.openId)) {
        return {
          ...item,
          isSelected: false
        }
      }
      return item
    })
    // 重新设置 .accountList
    await db.push(`.mallWithAccount.${mallId}.list`, list, true)

    await localDb.delete(`.usingAccount.${plateNo}`)
  }

  // data = {
  //   isWaitPay: true,
  //   UID: 0,
  //   Bonus: 0,
  //   WaitPayOrderId: 0,
  //   MallName: '成都港汇天地',
  //   ParkName: '成都港汇天地停车场',
  //   PlateNo: '川F5N0S2',
  //   Barcode: '',
  //   EntryTime: '2023-11-27 08:02:24',
  //   ParkingMinutes: 629,
  //   ParkingTotalFee: 5500,
  //   ParkingFee: 1000,
  //   PaidAmount: 4500,
  //   FreeAmount: 0,
  //   IsShowParkZeroPay: false,
  //   NeedPayAmount: 1000,
  //   ParkTel: '028-6011 3888',
  //   IsAccessPC: false,
  //   RegisterGuide: '',
  //   DelayTime: 30,
  //   IsUseRights: true,
  //   FeeId: 'd821d1d22db4476e832e4ed798ad69d0',
  //   RightsRuleModelList: [],
  //   DiscountLimit: {}
  // }

  // return nextResponse.success({
  //   isWaitPay,
  //   ...data
  // })

  return success({
    isWaitPay,
    ...data
  })
}

export async function POST() {
  return NextResponse.json({
    success: true,
    data: { key: 'post demo-api' }
  })
}
