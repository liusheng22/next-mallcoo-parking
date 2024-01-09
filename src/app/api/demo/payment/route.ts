import { failed, success } from '@/helper/response'
import { NextRequest } from 'next/server'
import { getQueryValue } from 'utils/api-route'

export async function GET(req: NextRequest) {
  const plateNo = getQueryValue(req, 'plateNo')
  if (!plateNo) {
    return failed()
  }

  return success(
    {
      key: 'get demo-api'
    },
    {
      crossDomain: true
    }
  )
}

export async function POST() {
  return success({
    key: 'post demo-api'
  })
}
