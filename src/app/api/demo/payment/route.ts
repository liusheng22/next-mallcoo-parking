import payment from '@/helper/payment'
import { failed, success } from '@/helper/response'
import { AccountItem, CarConfig } from '@/types/ui'
import { NextRequest } from 'next/server'
import { getQueryKey } from 'utils/api-route'
import { db } from 'utils/db'

export async function GET(req: NextRequest) {
  const plateNo = getQueryKey(req, 'plateNo')
  if (!plateNo) {
    return failed()
  }
  const testPayment = async (plateNo: string) => {
    // 获取当前车牌号下的账号列表
    const carConfig = (await db.getObjectDefault(
      `.usingAccount.${plateNo}`
    )) as CarConfig
    const { list: usingList } = carConfig || {}
    // // 找到第一个未支付的账号
    const account =
      (usingList.find((item) => !item.isPaid) as AccountItem) || {}
    // // 找到 index
    const index = usingList.findIndex((item) => !item.isPaid) || 0

    // 执行支付任务
    payment({
      ...account,
      ...carConfig,
      plateNo,
      index,
      accountTotal: usingList.length
    })
  }

  testPayment(plateNo)

  // const response = NextResponse.json({
  //   success: true,
  //   data: { key: 'get demo-api' }
  // })

  // // response.headers.set('Access-Control-Allow-Origin', '*')
  // // return response

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
