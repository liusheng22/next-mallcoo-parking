import { AccountItem, MallItem } from '@/types/ui'
import account from '../../mall-with-account.json'

// 定义 mallWithAccount 的类型
interface MallWithAccount {
  [key: string]: AccountItem[]
}
// 商场对应的账户列表
const mallWithAccount: MallWithAccount = account

// 根据商场来确定默认用来查询的账户的 account
export const defaultAccountListByMall = (mallId: string) => {
  const accountList = mallWithAccount[mallId] || []
  const defaultAccount = accountList.filter(
    (item: AccountItem) => item.isDefault
  )[0]
  const [firstAccount] = accountList || []
  return defaultAccount || firstAccount
}

// 根据商场来确定账户的 account
export const accountListByMall = (mallId: string) => {
  return mallWithAccount[mallId] || []
}

// 商场列表
export const mallList: MallItem[] = [
  {
    id: 1,
    name: '港汇天地',
    mallId: '11707',
    parkId: '985',
    projectType: '16706'
  },
  {
    id: 2,
    name: '远大购物中心',
    mallId: '11526',
    parkId: '985'
  },
  {
    id: 3,
    name: '三利爱琴海',
    mallId: '12689',
    parkId: '1550',
    projectType: '17464'
  }
]

// mallId 对应的 信息
export const mallInfo = (mallId: string) => {
  const [mall] =
    mallList.filter((item: MallItem) => item.mallId === mallId) || []
  return mall || {}
}
