import ChooseSingleAccount from 'components/ui/ChooseSingleAccount'
import ExistAutoPayment from 'components/ui/ExistAutoPayment'
import NotPlateNoInfo from 'components/ui/NotPlateNoInfo'
import ParkingInfo from 'components/ui/ParkingInfo'
import SelectPlateNumber from 'components/ui/SelectPlateNumber'
import { defaultAccountListByMall } from 'constants/index'
import { getAccountListApi } from 'helper/wrapper-api/account'
import { getParkInfoApi } from 'helper/wrapper-api/mallcoo'
import { use } from 'react'
import { AutoPaymentAccount } from './AutoPaymentAccount'

interface ParkFeeInfoProps {
  plateNo: string
  mallId: string
  parkId: string
  projectType: string
  hasPaymentAccount: boolean
}

export const AutoParkFeeInfo = (props: ParkFeeInfoProps) => {
  const { plateNo, mallId, parkId, projectType, hasPaymentAccount } = props
  const { uid } = defaultAccountListByMall(mallId)

  // 查询停车信息
  const queryStr = `uid=${uid}&plateNo=${plateNo}&mallId=${mallId}&parkId=${parkId}`
  console.log('ParkFeeInfo queryStr =>', queryStr)
  const getParkInfo = async () => {
    return getParkInfoApi(queryStr)
  }
  const getParkInfoFunc = getParkInfo()
  const parkInfo = use(getParkInfoFunc)
  console.log('ParkFeeInfo parkInfo =>', parkInfo)

  const { isWaitPay } = parkInfo

  // 查询账户信息
  const getAccountList = async () => {
    return getAccountListApi(mallId)
  }
  const getAccountListFunc = getAccountList()
  const accountList = use(getAccountListFunc)

  return (
    <>
      {/* 解构绑定多个参数 */}
      <ParkingInfo {...parkInfo} plateNo={plateNo} />
      {
        // 是否有待缴费的车辆
        isWaitPay ? (
          // 是否有为车辆设置了的自动缴费账户
          hasPaymentAccount ? (
            <AutoPaymentAccount plateNo={plateNo} />
          ) : (
            <SelectPlateNumber
              plateNo={plateNo}
              mallId={mallId}
              parkId={parkId}
              projectType={projectType}
              accountList={accountList}
            />
          )
        ) : (
          <NotPlateNoInfo plateNo={plateNo} />
        )
      }
    </>
  )
}

export const HandParkFeeInfo = (props: ParkFeeInfoProps) => {
  const { plateNo, mallId, parkId, projectType, hasPaymentAccount } = props
  const { uid } = defaultAccountListByMall(mallId)

  // 查询停车信息
  const queryStr = `uid=${uid}&plateNo=${plateNo}&mallId=${mallId}&parkId=${parkId}`
  console.log('ParkFeeInfo queryStr =>', queryStr)
  const getParkInfo = async () => {
    return getParkInfoApi(queryStr)
  }
  const getParkInfoFunc = getParkInfo()
  const parkInfo = use(getParkInfoFunc)
  console.log('ParkFeeInfo parkInfo =>', parkInfo)

  const { isWaitPay } = parkInfo

  // 查询账户信息
  const getAccountList = async () => {
    return getAccountListApi(mallId)
  }
  const getAccountListFunc = getAccountList()
  const accountList = use(getAccountListFunc)

  return (
    <>
      {/* 解构绑定多个参数 */}
      <ParkingInfo {...parkInfo} plateNo={plateNo} />
      {
        // 是否有待缴费的车辆
        isWaitPay ? (
          // 是否有为车辆设置了的自动缴费账户
          hasPaymentAccount ? (
            <ExistAutoPayment plateNo={plateNo} />
          ) : (
            <ChooseSingleAccount
              plateNo={plateNo}
              mallId={mallId}
              parkId={parkId}
              projectType={projectType}
              accountList={accountList}
            />
          )
        ) : (
          <NotPlateNoInfo plateNo={plateNo} />
        )
      }
    </>
  )
}
