import { success } from '@/helper/response'
import { NextRequest } from 'next/server'
import { getQuery } from 'utils/api-route'
import { cosDb } from 'utils/db'

export async function GET(req: NextRequest) {
  // const { plateNo } = getQuery(req)
  // const index = 0
  // await localDb.push(
  //   `.usingAccount.${plateNo}.list[${index}].isPaid`,
  //   true,
  //   true
  // )
  // const currentTime = dayjs().format('YYYY-MM-DD HH:mm:ss')
  // await localDb.push(
  //   `.usingAccount.${plateNo}.list[${index}].time`,
  //   currentTime,
  //   true
  // )

  const { mallId } = getQuery(req)
  const mallWithAccount = await cosDb.getObjectDefault(
    `.mallWithAccount.${mallId}`
  )

  return success(mallWithAccount)
}

export async function POST(req: NextRequest) {
  const { mallId } = await getQuery(req)
  const { json } = await req.json()
  await cosDb.push(`.mallWithAccount.${mallId}`, json, true)
  return success()
}
