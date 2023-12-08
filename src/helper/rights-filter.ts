import dayjs from 'dayjs'

interface Rights {
  RuleShowType: number
  OrderRecord: string
  RightsID: string
  RightsName: string
  RightsType: number
  Amount: number
  AllowanceAmount: number
  Minutes: number
  IsIntellegent: boolean
  RuleName: string
}

interface RightsList {
  RuleName: string
  RightsList: Rights[]
}

/**
 * 过滤所需的优惠权益
 * @param ruleList 权益列表
 * @param isOnlyFreeRights 仅仅获取免费权益
 * @returns {Rights} 所需权益
 */
export const rightsFilter = (
  ruleList: RightsList[],
  isOnlyFreeRights?: boolean
): any => {
  ruleList = ruleList || []
  let RuleName = ''
  let rights: any = {}

  // 判断当前时间是否 晚上21 点 & 第二天凌晨3 点之间
  const now = dayjs()
  const isNight =
    now.isAfter(dayjs().set('hour', 21).set('minute', 0).set('second', 0)) &&
    now.isBefore(
      dayjs().add(1, 'day').set('hour', 3).set('minute', 0).set('second', 0)
    )
  if (isNight && !isOnlyFreeRights) {
    const name = '商场停车券'
    RuleName = name
    const couponRights =
      ruleList.filter((item: any) => {
        return item.RuleName === name
      })[0] || {}
    const { RightsList } = couponRights
    rights =
      RightsList.filter((item: any) => {
        return item.OrderRecord === '3'
      })[0] || {}
  } else {
    const name = '会员权益'
    RuleName = name
    const freeRights =
      ruleList.filter((item: any) => {
        return item.RuleName === '会员权益'
      })[0] || {}
    // 权益列表
    const { RightsList } = freeRights
    rights =
      RightsList.filter((item: any) => {
        return item.OrderRecord === '2'
      })[0] || {}
  }

  return {
    ...rights,
    RuleName
  }
}
