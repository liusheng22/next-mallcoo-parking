import { fetcher } from '@/app/composables/use-fetcher'
import NotPlateNoInfo from '@/components/ui/NotPlateNoInfo'
import { defaultAccountListByMall } from '@/constants'
import { AccountItem, MallConfig } from '@/types/ui'
import { db } from '@/utils/db'
import ChooseSingleAccount from 'components/ui/ChooseSingleAccount'
import ExistAutoPayment from 'components/ui/ExistAutoPayment'
import { FC } from 'react'

interface pageProps {
  params: {
    info: string[]
  }
}

const page: FC<pageProps> = async ({ params }) => {
  const [mallId, queryPlateNo] = params.info || []
  const mallConfig = (await db.getObjectDefault(
    `.mallWithAccount.${mallId}`
  )) as MallConfig
  const { parkId, projectType } = mallConfig
  const { uid } = defaultAccountListByMall(mallId)
  const plateNo = decodeURIComponent(queryPlateNo).toUpperCase()

  // 是否有为车辆设置了的自动缴费账户
  let hasPaymentAccount = false
  const autoPaymentAccountList = (await db.getObjectDefault(
    `.usingAccount.${plateNo}.list`,
    []
  )) as AccountItem[]
  hasPaymentAccount = autoPaymentAccountList.length > 0

  const queryStr = `uid=${uid}&plateNo=${plateNo}&mallId=${mallId}&parkId=${parkId}`
  const parkInfo = await fetcher({
    url: `/api/mallcoo?${queryStr}`,
    method: 'GET'
  })
  const { isWaitPay } = parkInfo

  return (
    <>
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
            />
          )
        ) : (
          <NotPlateNoInfo plateNo={plateNo} />
        )
      }
    </>
  )
}

export default page
