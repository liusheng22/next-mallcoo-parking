import { mallInfo } from '@/constants'
import { fetchGetProIndexList, fetchReceiveCoupon } from '@/helper/payment/hui'
import { fetchLoginForThirdV2 } from '@/helper/payment/login'
import { success } from '@/helper/response'
import { AccountItem } from '@/types/ui'
import { fetcher } from 'app/composables/use-fetcher'
import { NextRequest } from 'next/server'
import { getQuery } from 'utils/api-route'
import { jsonBinDb } from 'utils/db'

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
  const { mallId, plateNo, openId } = getQuery(req)
  const { projectType } = mallInfo(mallId)
  const { Token: token } = await fetchLoginForThirdV2({ openId, mallId })
  const { PromotionModelList = [] } = await fetchGetProIndexList({
    mallId,
    token,
    projectType
  })
  console.log('可领取优惠列表 =>', PromotionModelList)
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
    (await jsonBinDb.getObjectDefault(`.usingAccount.${plateNo}.list`)) || []
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
