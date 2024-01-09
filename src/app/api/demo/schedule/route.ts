import { success } from '@/helper/response'
import ScheduleHelper from '@/helper/schedule'
import { NextRequest } from 'next/server'
import { getQuery } from 'utils/api-route'

export async function GET() {
  const schedule = new ScheduleHelper()
  schedule.createTask({
    name: 'curr 自动分发任务 0 0 12 * * *',
    // 每 3s 执行一次
    schedule: '*/3 * * * * *',
    // schedule: new Date(Date.now() + 1000 * 3),
    // schedule: new Date(Date.now() + 1000 * 60 * 55),
    task: () => {
      console.log('---执行任务---')
    }
  })
  setTimeout(() => {
    console.log('---取消任务---')
    schedule.cancelTask('curr 自动分发任务 0 0 12 * * *')
  }, 10000)

  success()
}

export async function POST(req: NextRequest) {
  const query = await getQuery(req)
  success(query)
}
