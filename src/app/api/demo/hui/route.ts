import { defaultAccountListByMall } from '@/constants'
import { fetchGetProIndexList } from '@/helper/payment/hui'
import { fetchLoginForThirdV2 } from '@/helper/payment/login'
import { success } from '@/helper/response'
import { NextRequest } from 'next/server'
import { getQuery } from 'utils/api-route'

export async function GET(req: NextRequest) {
  const { mallId } = getQuery(req)
  const { openId } = defaultAccountListByMall(mallId)
  const { Token: token, ProjectType: projectType } = await fetchLoginForThirdV2(
    {
      openId,
      mallId
    }
  )

  const data = await fetchGetProIndexList({
    mallId,
    token,
    projectType
  })

  return success(data)
}
