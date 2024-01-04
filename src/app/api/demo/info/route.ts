import { defaultAccountListByMall } from '@/constants'
import { fetchLoginForThirdV2 } from '@/helper/payment/login'
import { success } from '@/helper/response'
import { NextRequest } from 'next/server'
import { getQueryValue } from 'utils/api-route'

export async function GET(req: NextRequest) {
  const mallId = getQueryValue(req, 'mallId')
  const account = defaultAccountListByMall(mallId)
  const { openId } = account

  const loginInfo = await fetchLoginForThirdV2({
    mallId,
    openId
  })

  return success(loginInfo)
}
