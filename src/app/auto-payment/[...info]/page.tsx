import { JsonBinData } from '@/types/ui'
import { AutoParkFeeInfo } from 'components/func/ParkFeeInfo'
import { FC } from 'react'
import { cosDb } from 'utils/db'

interface pageProps {
  params: {
    info: string[]
  }
}

const page: FC<pageProps> = async ({ params }) => {
  const [mallId, queryPlateNo] = params.info || []
  const jsonBinData: JsonBinData = await cosDb.getObjectDefault(`.`)
  const { mallWithAccount = {}, usingAccount = {} } = jsonBinData || {}
  const mallConfig = mallWithAccount[mallId]
  console.log('jsonBinData =>', jsonBinData)
  console.log('mallConfig =>', mallConfig)

  const { parkId, projectType } = mallConfig || {}
  const plateNo = decodeURIComponent(queryPlateNo).toUpperCase()

  // 是否有为车辆设置了的自动缴费账户
  let hasPaymentAccount = false
  const carConfig = usingAccount[plateNo]
  console.log('usingAccount =>', usingAccount)
  console.log('carConfig =>', carConfig)
  const { list = [] } = carConfig || {}
  hasPaymentAccount = list && !!list.length
  console.log('hasPaymentAccount =>', hasPaymentAccount)

  return (
    <AutoParkFeeInfo
      plateNo={plateNo}
      mallId={mallId}
      parkId={parkId}
      projectType={projectType}
      hasPaymentAccount={hasPaymentAccount}
    />
  )
}

export default page
