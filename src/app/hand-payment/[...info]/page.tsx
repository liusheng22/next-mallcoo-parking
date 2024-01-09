import { JsonBinData } from '@/types/ui'
import { HandParkFeeInfo } from 'components/func/ParkFeeInfo'
import { FC } from 'react'
import { jsonBinDb } from 'utils/db'

interface pageProps {
  params: {
    info: string[]
  }
}

const page: FC<pageProps> = async ({ params }) => {
  const [mallId, queryPlateNo] = params.info || []
  const jsonBinData: JsonBinData = await jsonBinDb.getObjectDefault(`.`)
  console.log('jsonBinData =>', jsonBinData)
  const { mallWithAccount = {}, usingAccount = {} } = jsonBinData || {}
  console.log('usingAccount =>', usingAccount)
  const mallConfig = mallWithAccount[mallId]
  console.log('mallConfig =>', mallConfig)
  const { parkId, projectType } = mallConfig || {}
  const plateNo = decodeURIComponent(queryPlateNo).toUpperCase()

  // 是否有为车辆设置了的自动缴费账户
  let hasPaymentAccount = false
  const carConfig = usingAccount[plateNo]
  console.log('carConfig =>', carConfig)
  const { list = [] } = carConfig || {}
  hasPaymentAccount = list && !!list.length
  console.log('hasPaymentAccount =>', hasPaymentAccount)

  return (
    <HandParkFeeInfo
      plateNo={plateNo}
      mallId={mallId}
      parkId={parkId}
      projectType={projectType}
      hasPaymentAccount={hasPaymentAccount}
    />
  )
}

export default page
