import { fetchGetParkFeeInit } from '@/helper/payment/park-fee'
import { success } from '@/helper/response'
import { AccountItem, JsonBinData } from '@/types/ui'
import dayjs from 'dayjs'
import { NextRequest, NextResponse } from 'next/server'
import { getQuery } from 'utils/api-route'
import { cosDb } from 'utils/db'

export async function GET(req: NextRequest) {
  const { uid, plateNo, mallId, parkId } = getQuery(req)

  // 查询待缴费信息，根据 EntryTime 判断是否车辆在场
  const data = await fetchGetParkFeeInit({
    uid,
    plateNo,
    mallId,
    parkId
  })
  console.log('查询停车信息 =>', data)
  const { EntryTime } = data || {}
  // 是否有待缴费
  let isWaitPay = false
  // dayjs 判断是否为有效时间
  if (EntryTime && dayjs(EntryTime).isValid()) {
    isWaitPay = true
  } else {
    const jsonBinData: JsonBinData = await cosDb.getObjectDefault(`.`)
    const { mallWithAccount = {}, usingAccount = {} } = jsonBinData || {}
    const mallConfig = mallWithAccount[mallId]
    const { list: accountList } = mallConfig || {}

    const carConfig = usingAccount[plateNo]
    const { list: paymentAccountList } = carConfig || {}

    // 无待缴费的车辆信息，清空 db 中的车辆信息
    // const paymentAccountList = (await cosDb.getObjectDefault(
    //   `.usingAccount.${plateNo}.list`,
    //   []
    // )) as AccountItem[]
    // 未使用的账号
    const unUsedOpenIdList = paymentAccountList
      .filter((item: AccountItem) => !item.isPaid)
      .map((item: AccountItem) => item.openId)
    // 反哺到原始数据
    // const accountList: AccountItem[] =
    //   (await cosDb.getObjectDefault(`.mallWithAccount.${mallId}.list`)) || []
    // const list = accountList.map((item: AccountItem) => {
    //   if (unUsedOpenIdList.includes(item.openId)) {
    //     return {
    //       ...item,
    //       isSelected: false
    //     }
    //   }
    //   return item
    // })

    const list = (accountList || []).map((item: AccountItem) => {
      if (unUsedOpenIdList.includes(item.openId)) {
        return {
          ...item,
          isSelected: false
        }
      }
      return item
    })

    // 重新设置 .accountList
    // await cosDb.push(`.mallWithAccount.${mallId}.list`, list, true)
    // await cosDb.delete(`.usingAccount.${plateNo}`)

    await cosDb.push(`.mallWithAccount.${mallId}.list`, list, true)
    cosDb.delete(`.usingAccount.${plateNo}`)
  }

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
