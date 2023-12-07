import { Job, scheduleJob } from 'node-schedule'

interface TaskDefinition {
  name: string
  schedule: string | Date
  task: () => void
}

export default class ScheduleHelper {
  private tasks: Job[] = []

  /**
   * 创建任务
   * @param taskDefinition 任务定义
   * @param isClosePrevTask 是否关闭上一个该任务
   */
  public createTask(
    taskDefinition: TaskDefinition,
    isClosePrevTask?: boolean
  ): void {
    const { name, schedule, task } = taskDefinition
    if (isClosePrevTask) {
      // 查找任务是否存在
      const prevTask = this.findTask(name)
      // 存在则取消任务
      prevTask && this.cancelTask(name)
    }
    const job = scheduleJob(name, schedule, task)
    this.tasks.push(job)
  }

  // 查找任务
  public findTask(taskName: string): Job | undefined {
    return this.tasks.find((task) => task.name === taskName)
  }

  public cancelTask(taskName: string): void {
    const job = this.tasks.find((task) => task.name === taskName)
    if (job) {
      job.cancel()
      this.tasks = this.tasks.filter((task) => task.name !== taskName)
    }
  }

  public cancelAllTasks(): void {
    this.tasks.forEach((task) => task.cancel())
    this.tasks = []
  }
}
