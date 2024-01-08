import { success } from '@/helper/response'
import { NextRequest } from 'next/server'
import { getQuery } from 'utils/api-route'

export async function GET(req: NextRequest) {
  const query = getQuery(req)
  console.log('getMallcooApi query =>', query)

  return success(query, { crossDomain: true })
}

export async function POST(req: NextRequest) {
  const json = await req.json()
  return success(json)
}
