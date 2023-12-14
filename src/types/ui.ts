// 账户信息
export interface AccountItem {
  id: number | string
  name: string
  openId: string
  uid: string
  projectType?: string
  usedTime?: string
  isSelected: boolean
  isPaid: boolean
  isDefault?: boolean
  time?: string
}

// 每个车牌配置
export interface CarConfig {
  plateNo: string
  mallId: string
  parkId: string
  token?: string
  projectType?: string
  freeMin?: number
  freeAmount?: number
  list: AccountItem[]
}

// 商场配置
export interface MallConfig {
  plateNo: string
  mallId: string
  parkId: string
  projectType: string
  list: AccountItem[]
}

// 缴费信息
export interface PayInfo {
  uid?: string | number
  openId?: string
  parkId?: string
  projectType?: string
  plateNo?: string
  mallId?: string
  token?: string
  entryTime?: string
}

// 商场信息
export interface MallItem {
  id: number | string
  name: string
  mallId: string
  projectType?: string
  parkId: string
}
