import { accountListByMall, mallList } from '@/constants'
import { RESET_KEY } from '@/constants/schedule'
import ScheduleHelper from '@/helper/schedule'
import { MallConfig } from '@/types/ui'
import { db, localDb } from '@/utils/db'

/**
 * 初始化账号列表
 * @params isForce 是否强制初始化
 */
export const initAccount = async (mallInfo: any, isForce?: boolean) => {
  const { mallId, parkId, projectType } = mallInfo
  const dbMallConfig: MallConfig =
    (await db.getObjectDefault(`.mallWithAccount.${mallId}`)) || {}
  const { list: dbAccountList } = dbMallConfig
  const accountList = accountListByMall(mallId)

  const mallConfig = {
    mallId,
    parkId,
    projectType,
    list: accountList
  }
  if (isForce) {
    // 定时更新
    if (dbAccountList && dbAccountList.length) {
      localDb.push(`.mallWithAccount.${mallId}.list`, accountList, true)
    }
  } else {
    // 手动更新
    if (!dbAccountList || !dbAccountList.length) {
      localDb.push(`.mallWithAccount.${mallId}`, mallConfig, false)
    }
  }

  return
}

/**
 * 初始化定时任务
 */
export const initSchedule = () => {
  const schedule = new ScheduleHelper()
  const task = schedule.findTask(RESET_KEY)
  if (task) {
    schedule.cancelTask(RESET_KEY)
  }
  schedule.createTask({
    name: RESET_KEY,
    // 每天凌晨 0 点执行
    schedule: '0 0 0 * * *',
    // 每 5s 执行一次
    // schedule: '*/5 * * * * *',
    task: async () => {
      console.log('-- 0 点执行 --', new Date())
      console.log('-- 0 点数据 --', mallList)
      for (let i = 0; i < mallList.length; i++) {
        const { mallId } = mallList[i]
        await initAccount({ mallId }, true)
      }
    }
  })

  return
}
