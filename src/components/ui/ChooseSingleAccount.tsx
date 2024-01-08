'use client'

import { fetcher } from '@/app/composables/use-fetcher'
import { AccountItem } from '@/types/ui'
import { useRouter } from 'next/navigation'
import { FC, useState } from 'react'
import CheckAccount from './CheckAccount'
import FullButton from './FullButton'

interface Props {
  mallId: string
  parkId: string
  plateNo: string
  projectType: string
  accountList: AccountItem[]
}

const ChooseSingleAccount: FC<Props> = (props) => {
  const { plateNo, mallId, accountList } = props
  const router = useRouter()
  // const [accountList, setAccountList] = useState<AccountItem[]>([])
  const [selected, setSelected] = useState<string[]>([])

  const submit = async () => {
    console.log('submit:', selected)
    const [selectedOpenId] = selected
    const [account] =
      accountList.filter(
        (item: AccountItem) => item.openId === selectedOpenId
      ) || []

    // 手动支付
    const result = await fetcher({
      url: `/api/payment-account`,
      method: 'PUT',
      data: { ...account, plateNo, mallId }
    })

    console.log('支付结果 =>', result)
    // todo: toast 成功
    router.refresh()
  }

  // const getAccountList = async () => {
  //   const data = await fetcher({
  //     url: `/api/account?mallId=${mallId}`,
  //     method: 'GET'
  //   })
  //   setAccountList(data)
  // }

  // useEffect(() => {
  //   getAccountList()
  // }, [])

  return (
    <>
      <div className="flex w-full flex-col md:flex-nowrap gap-4">
        {accountList.length ? (
          <CheckAccount
            plateNo={plateNo}
            accountList={accountList}
            selected={selected}
            setSelected={setSelected}
          />
        ) : (
          <div className="text-center">No account</div>
        )}

        <FullButton onClick={submit}>Submit</FullButton>
      </div>
    </>
  )
}

export default ChooseSingleAccount
