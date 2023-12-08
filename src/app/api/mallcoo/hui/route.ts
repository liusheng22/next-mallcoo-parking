import { defaultAccountListByMall, mallInfo } from '@/constants'
import { fetchGetProIndexList, fetchReceiveCoupon } from '@/helper/payment/hui'
import { fetchLoginForThirdV2 } from '@/helper/payment/login'
import { success } from '@/helper/response'
import { AccountItem } from '@/types/ui'
import { fetcher } from 'app/composables/use-fetcher'
import { NextRequest } from 'next/server'
import { getQueryKey } from 'utils/api-route'
import { db } from 'utils/db'

// 查询可以领取的优惠券
export async function GET(req: NextRequest) {
  // const searchParams = new URLSearchParams(req.nextUrl.searchParams)
  // const plateNo = searchParams.get('plateNo')
  // const mallId = getQueryKey(req, 'mallId')
  // const token = getQueryKey(req, 'token')

  // const url = `/api/mallcoo/hui?mallId=${req.query.mallId}&token=${req.query.token}`
  // fetcher({ url })

  const mallId = getQueryKey(req, 'mallId') as string
  const plateNo = getQueryKey(req, 'plateNo') as string
  const queryOpenId = getQueryKey(req, 'openId') as string
  const { projectType } = mallInfo(mallId)
  const { openId } = defaultAccountListByMall(mallId)
  const { Token: token } = await fetchLoginForThirdV2({ openId, mallId })
  const { PromotionModelList = [] } = await fetchGetProIndexList({
    mallId,
    token,
    projectType
  })
  // POST(PromotionModelList)
  await fetcher({
    url: '/api/mallcoo/hui',
    method: 'POST',
    data: {
      openId: queryOpenId,
      plateNo,
      list: PromotionModelList
    }
  })
  return success(PromotionModelList)
}

// 领取优惠券
export async function POST(req: NextRequest) {
  const { openId: queryOpenId, plateNo, list = [] } = (await req.json()) || {}
  const accountList: AccountItem[] =
    (await db.getObjectDefault(`.usingAccount.${plateNo}.list`)) || []
  if (queryOpenId) {
    // 某些优惠券需要领取两次
    for (const item of list) {
      await fetchReceiveCoupon({ ...item, openId: queryOpenId })
      await fetchReceiveCoupon({ ...item, openId: queryOpenId })
    }
  } else {
    for (const account of accountList) {
      const { openId } = account
      for (const item of list) {
        // 某些优惠券需要领取两次
        await fetchReceiveCoupon({ ...item, openId })
        await fetchReceiveCoupon({ ...item, openId })
      }
    }
  }

  return success()
}
