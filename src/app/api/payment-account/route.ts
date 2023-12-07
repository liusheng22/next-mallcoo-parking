import { defaultAccountListByMall, mallInfo } from '@/constants'
import payment from '@/helper/payment'
import { fetchDiscountCoreQuery } from '@/helper/payment/discount'
import { fetchLoginForThirdV2 } from '@/helper/payment/login'
import { fetchGetParkFeeInit } from '@/helper/payment/park-fee'
import { failed, success } from '@/helper/response'
import ScheduleHelper from '@/helper/schedule'
import { AccountItem, CarConfig, PayInfo } from '@/types/ui'
import { db, localDb } from '@/utils/db'
import { fetcher } from 'app/composables/use-fetcher'
import dayjs from 'dayjs'
import { NextRequest } from 'next/server'
import { getQueryKey } from 'utils/api-route'

// 自动支付任务
const paymentSchedule = async (query: PayInfo) => {
  const { plateNo, entryTime } = query
  const schedule = new ScheduleHelper()

  const carConfig: CarConfig = await db.getObjectDefault(
    `.usingAccount.${plateNo}`
  )
  const { freeMin } = carConfig || {}
  const min = parseInt(String(freeMin)) - 5

  // 定时执行的任务
  const paymentTask = async () => {
    const usingList: AccountItem[] =
      (await db.getObjectDefault(`.usingAccount.${plateNo}.list`, [])) || []
    // // 找到第一个未支付的账号
    const account = usingList.find((item) => !item.isPaid)
    // // 找到 index
    const index = usingList.findIndex((item) => !item.isPaid)

    if (!account) {
      // 如果没有未支付的账号，则取消任务
      schedule.cancelTask(plateNo as string)
      return
    }

    // const { EntryTime } = await fetchGetParkFeeInit(account.uid, plateNo)
    // 距离入场时间多少分钟
    // const minutes = dayjs().diff(EntryTime, 'minute')
    // 根据免费时长&入场时间，判断是否需要支付

    console.log('执行定时任务时间', dayjs().format('YYYY:MM:DD HH:mm:ss'))
    console.log('执行定时支付任务', {
      ...account,
      ...carConfig,
      plateNo,
      index,
      accountTotal: usingList.length
    })

    // 执行支付任务
    const [ok] = await payment({
      ...account,
      ...carConfig,
      plateNo: plateNo as string,
      index,
      accountTotal: usingList.length
    })

    if (!ok) {
      return false
    }

    // 更新账号状态
    const currentTime = dayjs().format('YYYY:MM:DD HH:mm:ss')
    await localDb.push(
      `.usingAccount.${plateNo}.list[${index}].isPaid`,
      true,
      true
    )
    await localDb.push(
      `.usingAccount.${plateNo}.list[${index}].time`,
      currentTime,
      true
    )

    // 重新设置任务
    if (min <= 0) {
      return false
    }

    const time = dayjs().add(min, 'minute').valueOf()
    // 再进行下一个账号的支付
    schedule.createTask(
      {
        name: plateNo as string,
        schedule: new Date(time),
        task: paymentTask
      },
      true
    )
  }

  // 重新设置任务
  if (min <= 0) {
    return false
  }

  let time = entryTime ? dayjs(entryTime).valueOf() : dayjs().valueOf()
  // 如果 time 已经过去了，则 time 继续+min，递归
  const addMin = () => {
    const now = dayjs().valueOf()
    if (time <= now) {
      time = dayjs(time).add(min, 'minute').valueOf()
      addMin()
    }
  }
  addMin()
  // const now = dayjs().valueOf()
  // if (time < now) {
  //   time = dayjs(time).add(min, 'minute').valueOf()
  // }

  schedule.createTask(
    {
      name: plateNo as string,
      // schedule: `0 */${min} * * * *`,
      // schedule: new Date(Date.now() + 5000),
      // 在入场时间的基础上，+min 然后执行一次
      schedule: new Date(time),
      task: paymentTask
    },
    true
  )

  return carConfig
}

// 获取当前车牌号下的账号列表
export async function GET(req: NextRequest) {
  const plateNo = getQueryKey(req, 'plateNo')
  if (!plateNo) {
    return failed()
  }

  const list = (await db.getObjectDefault(
    `.usingAccount.${plateNo}.list`,
    []
  )) as AccountItem[]

  return success(list)
}

// 设置自动缴费的账号信息
export async function POST(req: NextRequest) {
  const { mallId, parkId, projectType, plateNo, selectAccountList } =
    (await req.json()) || {}

  const { uid, openId } = defaultAccountListByMall(mallId)
  const {
    EntryTime: entryTime,
    NeedPayAmount,
    ParkingMinutes
  } = await fetchGetParkFeeInit({
    uid,
    mallId,
    plateNo,
    parkId
  })
  const { Token } = await fetchLoginForThirdV2({ openId, mallId })
  const { RightsRuleModelList } = await fetchDiscountCoreQuery({
    plateNo,
    parkId,
    projectType,
    mallId,
    token: Token,
    needPayAmount: NeedPayAmount,
    parkingMinutes: ParkingMinutes
  })
  const list = RightsRuleModelList || []
  const ruleModel =
    list.filter((item: any) => item.RuleName === '会员权益')[0] || {}
  const { RightsList } = ruleModel
  const rightsList = RightsList || []
  const rights =
    rightsList.filter((item: any) => item.RightsType === 1)[0] || {}
  const { Minutes = 0, Amount = 0 } = rights

  const carConfig: CarConfig = {
    plateNo,
    mallId,
    parkId,
    projectType,
    // 免费时长
    freeMin: Minutes,
    freeAmount: Amount,
    // 自动缴费的账号列表
    list: selectAccountList
  }
  await db.push(
    '.usingAccount',
    {
      [plateNo]: carConfig
    },
    false
  )

  const data = await paymentSchedule({
    plateNo,
    entryTime
  })
  console.log('🚀 ~ file: route.ts:206 ~ POST ~ data:', data)

  // 查询并领取优惠券
  const url = `/api/mallcoo/hui?mallId=${mallId}&plateNo=${plateNo}`
  fetcher({ url })

  return success(data)
}

// 手动执行自动缴费的任务
export async function PUT(req: NextRequest) {
  const account = (await await req.json()) || {}
  const { openId, plateNo, mallId } = account
  if (!openId || !plateNo) {
    return failed()
  }

  const mall = mallInfo(mallId)

  const [ok, data] = await payment({
    ...account,
    ...mall
  })
  if (!ok) {
    return failed()
  }

  return success(data)
}

// 移除自动缴费的账号信息
export async function DELETE(req: NextRequest) {
  const plateNo = getQueryKey(req, 'plateNo')
  if (!plateNo) {
    return failed()
  }

  // 取消定时任务
  const schedule = new ScheduleHelper()
  schedule.cancelTask(plateNo)

  await localDb.delete(`.usingAccount.${plateNo}`)

  return success()
}
