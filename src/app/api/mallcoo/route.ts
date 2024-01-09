import { AccountItem, JsonBinData } from '@/types/ui'
import dayjs from 'dayjs'
import { fetchGetParkFeeInit } from 'helper/payment/park-fee'
import { success } from 'helper/response'
import { NextRequest, NextResponse } from 'next/server'
import { getQuery } from 'utils/api-route'
import { jsonBinDb } from 'utils/db'

export async function GET(req: NextRequest) {
  const query = getQuery(req)
  console.log('getMallcooApi query =>', query)
  const { uid, plateNo, mallId, parkId } = query || {}

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
    const jsonBinData: JsonBinData = await jsonBinDb.getObjectDefault(`.`)
    const { mallWithAccount = {}, usingAccount = {} } = jsonBinData || {}
    const mallConfig = mallWithAccount[mallId]
    let { list: accountList } = mallConfig || {}
    accountList = accountList || []

    const carConfig = usingAccount[plateNo]
    let { list: paymentAccountList } = carConfig || {}
    // 无待缴费的车辆信息，清空 db 中的车辆信息
    paymentAccountList = paymentAccountList || []
    // 未使用的账号
    const unUsedOpenIdList = paymentAccountList
      .filter((item: AccountItem) => !item.isPaid)
      .map((item: AccountItem) => item.openId)

    // 反哺到原始数据
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
    await jsonBinDb.push(`.mallWithAccount.${mallId}.list`, list, true)
    jsonBinDb.delete(`.usingAccount.${plateNo}`)
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
