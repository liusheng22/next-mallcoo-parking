import { AccountItem, CarConfig } from './ui'

export interface PaymentParams extends AccountItem, CarConfig {
  index: number
  plateNo: string
  accountTotal: number
}

export interface MallcooData {
  Token?: string
  OrderID?: string
  ProjectType?: string
  PayOrderId?: string
  NeedPayAmount?: number
  ParkingMinutes?: number
  WeChatMiniProgramOpenID?: string
  ParkName?: string
  EntryTime?: string
  RightsRuleModelList?: any[]
  RightsList?: any[]
  RightsID?: string
}
