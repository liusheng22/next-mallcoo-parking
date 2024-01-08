import UsingPayAccount from 'components/ui/UsingPayAccount'
import { getPlateNoInfo } from 'helper/wrapper-api/mallcoo'
import { use } from 'react'

export const AutoPaymentAccount = ({ plateNo }: { plateNo: string }) => {
  const getData = async (plateNo: string) => {
    return getPlateNoInfo(plateNo)
  }

  const func = getData(plateNo)
  const usingList = use(func)

  return (
    <div>
      <UsingPayAccount plateNo={plateNo} usingList={usingList} />
    </div>
  )
}
