import { success } from '@/helper/response'
import { initAccount, initSchedule } from '@/libs/account'
import { NextRequest } from 'next/server'
import { getQuery } from 'utils/api-route'
import { cosDb } from 'utils/db'

export async function GET(req: NextRequest) {
  const { mallId, parkId, projectType } = getQuery(req)
  await initAccount({
    mallId,
    parkId,
    projectType
  })
  // initSchedule()
  return success()
}

export async function POST(req: NextRequest) {
  const query = await req.json()
  await cosDb.initBin()
  initSchedule()

  return success(query)
}
