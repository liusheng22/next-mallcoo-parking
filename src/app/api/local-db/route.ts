import { success } from '@/helper/response'
import { NextRequest } from 'next/server'
import { getQuery } from 'utils/api-route'
import { db } from 'utils/db'

export async function GET(req: NextRequest) {
  const { mainKey, minorKey } = getQuery(req)
  const data = await db.getObjectDefault(`.${mainKey}.${minorKey}`)

  return success(data)
}

export async function POST(req: NextRequest) {
  const query = await req.json()
  return success(query)
}
