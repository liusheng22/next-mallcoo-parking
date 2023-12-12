import { mallInfo } from '@/constants'
import { fetchGetProIndexList, fetchReceiveCoupon } from '@/helper/payment/hui'
import { fetchLoginForThirdV2 } from '@/helper/payment/login'
import { success } from '@/helper/response'
import { AccountItem } from '@/types/ui'
import { fetcher } from 'app/composables/use-fetcher'
import { NextRequest } from 'next/server'
import { getQuery } from 'utils/api-route'
import { cosDb } from 'utils/db'

// 领取优惠券
const postMallcooHuiApi = async (data: any) => {
  return await fetcher({
    url: '/api/mallcoo/hui',
    method: 'POST',
    data
  })
}

// 查询可以领取的优惠券
export async function GET(req: NextRequest) {
  // const searchParams = new URLSearchParams(req.nextUrl.searchParams)
  // const plateNo = searchParams.get('plateNo')
  // const mallId = getQueryKey(req, 'mallId')
  // const token = getQueryKey(req, 'token')

  // const url = `/api/mallcoo/hui?mallId=${req.query.mallId}&token=${req.query.token}`
  // fetcher({ url })

  // const mallId = getQueryKey(req, 'mallId') as string
  // const plateNo = getQueryKey(req, 'plateNo') as string
  // // const queryOpenId = getQueryKey(req, 'openId') as string
  // const openId = getQueryKey(req, 'openId') as string

  const { mallId, plateNo, openId } = getQuery(req)
  const { projectType } = mallInfo(mallId)
  // const { openId } = defaultAccountListByMall(mallId)
  const { Token: token } = await fetchLoginForThirdV2({ openId, mallId })
  const { PromotionModelList = [] } = await fetchGetProIndexList({
    mallId,
    token,
    projectType
  })
  console.log('可领取优惠列表 =>', PromotionModelList)
  // POST(PromotionModelList)
  const list = PromotionModelList.map((item: any) => {
    const { MallID, ID, Name } = item
    return {
      MallID,
      ID,
      Name
    }
  })
  await postMallcooHuiApi({
    openId,
    plateNo,
    token,
    projectType,
    list
  })

  return success()
}

// 领取优惠券
export async function POST(req: NextRequest) {
  const text = await req.text()
  const query = JSON.parse(text) as any

  const {
    openId: queryOpenId,
    plateNo,
    token,
    projectType,
    list = []
  } = query || {}
  const accountList: AccountItem[] =
    (await cosDb.getObjectDefault(`.usingAccount.${plateNo}.list`)) || []
  if (queryOpenId) {
    // 某些优惠券需要领取两次
    for (const item of list) {
      await fetchReceiveCoupon({
        ...item,
        openId: queryOpenId,
        projectType,
        token
      })
      await fetchReceiveCoupon({
        ...item,
        openId: queryOpenId,
        projectType,
        token
      })
    }
  } else {
    for (const account of accountList) {
      const { openId } = account
      for (const item of list) {
        // 某些优惠券需要领取两次
        await fetchReceiveCoupon({
          ...item,
          openId,
          projectType,
          token
        })
        await fetchReceiveCoupon({
          ...item,
          openId,
          projectType,
          token
        })
      }
    }
  }

  return success()
}
