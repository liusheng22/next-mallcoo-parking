import { success } from 'helper/response'
import { NextRequest } from 'next/server'
import { getQuery } from 'utils/api-route'
import { jsonBinDb } from 'utils/db'

export async function GET(req: NextRequest) {
  const { mallId } = getQuery(req)
  const mallWithAccount = await jsonBinDb.getObjectDefault(
    `.mallWithAccount.${mallId}`
  )

  return success(mallWithAccount)
}

export async function POST(req: NextRequest) {
  const { mallId } = await getQuery(req)
  const { json } = await req.json()
  await jsonBinDb.push(`.mallWithAccount.${mallId}`, json, true)
  return success()
}
