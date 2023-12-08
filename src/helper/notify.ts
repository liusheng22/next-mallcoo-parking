import { MallcooData } from '@/types/mallcoo'
import dayjs from 'dayjs'

/**
 * 发送通知
 * @param {*} title 通知的标题
 * @param {*} content 通知的内容
 */
const sendNotify = async (title: string, content: string) => {
  const pushKey = 'PDU20224T8VH7ZClnAJwtFkXFB55uF9bgnNzmm81w'
  const url = `https://api2.pushdeer.com/message/push?pushkey=${pushKey}&text=${title}&desp=${content}&type=markdown`

  return await fetch(url)
}

const mins2duration = (mins: number) => {
  // 数据处理
  let ParkingDuration = ''
  if (mins) {
    if (mins > 60) {
      const hour = Math.floor(mins / 60)
      const min = mins % 60
      ParkingDuration = `${hour}小时${min}分`
    } else {
      ParkingDuration = `${mins}分`
    }
  }
  return ParkingDuration
}

/**
 * 发送成功通知
 * @param {*} info
 */
export const sendSuccessNotify = async (info: MallcooData) => {
  const { PayTimes, PlateNo, ParkingMinutes, ParkName, EntryTime } = info || {}

  // 数据处理
  const ParkingDuration = mins2duration(ParkingMinutes || 0)

  // 通知的标题，今日第N次缴费成功🎉
  let title = ''
  if (PayTimes) {
    title = encodeURIComponent(`今日第${PayTimes}次缴费成功🎉`)
  } else {
    title = encodeURIComponent(`${dayjs().format('HH:mm:ss')} 停车缴费成功🎉`)
  }

  // 通知的内容
  let des = `\n\r`
  des += `**缴费时间**：${dayjs().format('YYYY-MM-DD HH:mm:ss')}\n\r`
  if (PlateNo) {
    des += `**车牌号**：${PlateNo}\n\r`
  }
  des += `**缴费金额**：免费\n\r`
  if (ParkName) {
    des += `**停车场**：${ParkName}\n\r`
  }
  if (EntryTime) {
    des += `**入场时间**：${EntryTime}\n\r`
  }
  if (ParkingMinutes) {
    des += `**停车时长**：${ParkingDuration}\n\r`
  }
  const encodeDes = encodeURIComponent(des)

  return await sendNotify(title, encodeDes)
}

export const sendFailNotify = async (info: MallcooData) => {
  const { PayTimes, PlateNo, ParkingMinutes, ParkName, EntryTime, Remark } =
    info || {}

  // 数据处理
  const ParkingDuration = mins2duration(ParkingMinutes || 0)

  // 通知的标题，今日第N次缴费失败😭
  let title = ''
  if (PayTimes) {
    title = encodeURIComponent(`今日第${PayTimes}次缴费失败😭`)
  } else {
    title = encodeURIComponent(`${dayjs().format('HH:mm:ss')} 停车缴费失败😭`)
  }

  // 通知的内容
  let des = `\n\r`
  des += `**缴费时间**：${dayjs().format('YYYY-MM-DD HH:mm:ss')}\n\r`
  if (PlateNo) {
    des += `**车牌号**：${PlateNo}\n\r`
  }
  if (ParkName) {
    des += `**停车场**：${ParkName}\n\r`
  }
  if (EntryTime) {
    des += `**入场时间**：${EntryTime}\n\r`
  }
  if (ParkingMinutes) {
    des += `**停车时长**：${ParkingDuration}\n\r`
  }
  if (Remark) {
    des += `**失败原因**：${Remark}\n\r`
  }
  const encodeDes = encodeURIComponent(des)

  return await sendNotify(title, encodeDes)
}
