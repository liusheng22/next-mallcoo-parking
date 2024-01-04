import { fetcher } from '@/app/composables/use-fetcher'
import NotPlateNoInfo from '@/components/ui/NotPlateNoInfo'
import { defaultAccountListByMall } from '@/constants'
import { AccountItem, MallConfig } from '@/types/ui'
import UsingPayAccount from 'components/ui/UsingPayAccount'
import { FC, use } from 'react'
import SelectPlateNumber from 'ui/SelectPlateNumber'
import { cosDb } from 'utils/db'

const getPlateNoInfo = async (plateNo: string) => {
  const data = await fetcher({
    url: `/api/payment-account?plateNo=${plateNo}`,
    method: 'GET'
  })

  return data || []
}

const AutoPaymentAccount = ({ plateNo }: { plateNo: string }) => {
  const getData = async (plateNo: string) => {
    return getPlateNoInfo(plateNo)
  }

  const func = getData(plateNo)
  const usingList = use(func)

  return (
    <>
      <UsingPayAccount plateNo={plateNo} usingList={usingList} />
    </>
  )
}

interface pageProps {
  params: {
    info: string[]
  }
}

const page: FC<pageProps> = async ({ params }) => {
  const [mallId, queryPlateNo] = params.info || []
  const mallConfig = ((await cosDb.getObjectDefault(
    `.mallWithAccount.${mallId}`
  )) || {}) as MallConfig
  // const mallConfig = ((await cosDb.getObjectDefault(
  //   `.mallWithAccount.${mallId}`
  // )) || {}) as MallConfig

  // let mallConfig = await fetcher({
  //   url: `/api/local-db?mainKey=mallWithAccount&minorKey=${mallId}`,
  //   method: 'GET'
  // })

  // const response = await fetch(
  //   'https://cdn-1257429552.cos.ap-guangzhou.myqcloud.com/json/local-db.json'
  // )
  // const stringified = await response.text()
  // const fileJsonObj = JSON.parse(stringified) || {}
  // console.log('fileJsonObj =>', fileJsonObj)
  // const { mallWithAccount = {} } = fileJsonObj || {}
  // mallConfig = mallWithAccount['11707']

  const { parkId, projectType } = mallConfig || {}
  const { uid } = defaultAccountListByMall(mallId)
  const plateNo = decodeURIComponent(queryPlateNo).toUpperCase()

  // 是否有为车辆设置了的自动缴费账户
  let hasPaymentAccount = false
  const autoPaymentAccountList: AccountItem[] =
    (await cosDb.getObjectDefault(`.usingAccount.${plateNo}.list`)) || []
  console.log('autoPaymentAccountList =>', autoPaymentAccountList)
  hasPaymentAccount =
    autoPaymentAccountList && autoPaymentAccountList.length > 0

  const queryStr = `uid=${uid}&plateNo=${plateNo}&mallId=${mallId}&parkId=${parkId}`
  const parkInfo = await fetcher({
    url: `/api/mallcoo?${queryStr}`,
    method: 'GET'
  })
  const { isWaitPay } = parkInfo

  const accountList = await fetcher({
    url: `/api/account?mallId=${mallId}`,
    method: 'GET'
  })

  return (
    <div>
      <div>
        <div>uid: {uid}</div>
        <div>plateNo: {plateNo}</div>
        <div>mallId: {mallId}</div>
        <div>parkId: {parkId}</div>
        {/* <div>mallConfig: {JSON.stringify(mallConfig)}</div> */}
      </div>
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
    </div>
  )
}

export default page
