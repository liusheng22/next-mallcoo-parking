import { fetchGetParkFeeInit } from '@/helper/payment/park-fee'
import { success } from '@/helper/response'
import { NextRequest } from 'next/server'
import { getQuery } from 'utils/api-route'

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

  return success(data)
}

export async function POST(req: NextRequest) {
  const json = await req.json()
  return success(json)
}
