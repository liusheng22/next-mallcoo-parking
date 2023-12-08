import { success } from '@/helper/response'
import dayjs from 'dayjs'
import { NextRequest } from 'next/server'
import { getQuery } from 'utils/api-route'
import { localDb } from 'utils/db'

export async function GET(req: NextRequest) {
  const { plateNo } = getQuery(req)
  const index = 0
  await localDb.push(
    `.usingAccount.${plateNo}.list[${index}].isPaid`,
    true,
    true
  )
  const currentTime = dayjs().format('YYYY-MM-DD HH:mm:ss')
  await localDb.push(
    `.usingAccount.${plateNo}.list[${index}].time`,
    currentTime,
    true
  )

  return success()
}
