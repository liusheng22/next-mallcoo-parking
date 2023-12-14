'use client'

import { fetcher } from '@/app/composables/use-fetcher'
import { AccountItem } from '@/types/ui'
import { useRouter } from 'next/navigation'
import { FC, useEffect, useState } from 'react'
import CheckAccount from './CheckAccount'
import FullButton from './FullButton'

interface Props {
  mallId: string
  parkId: string
  plateNo: string
  projectType: string
}

const SelectPlateNumber: FC<Props> = (props) => {
  const { plateNo, mallId, parkId, projectType } = props
  const router = useRouter()
  const [accountList, setAccountList] = useState<AccountItem[]>([])
  const [selected, setSelected] = useState<string[]>([])

  const setCarPaymentInfo = async (selected: string[]) => {
    const selectAccountList = accountList
      .filter((item: AccountItem) => {
        const { openId } = item
        return selected.includes(openId)
      })
      .map((item: AccountItem) => {
        return {
          ...item,
          isSelected: true
        }
      })
    const params = {
      plateNo,
      mallId,
      parkId,
      projectType,
      selectAccountList
    }

    return await fetcher({
      url: `/api/payment-account?plateNo=${plateNo}`,
      method: 'POST',
      data: params
    })
  }

  const updateAccountListStatus = async (selected: string[]) => {
    return await fetcher({
      url: '/api/account',
      method: 'POST',
      data: { selected, mallId }
    })
  }

  const submit = async () => {
    console.log('submit:', selected)
    await updateAccountListStatus(selected)

    // 设置为车辆进行自动缴费的账户列表
    // await setCarPaymentInfo(selected)
    await setCarPaymentInfo(selected)

    // 缓存问题导致页面不会刷新
    router.refresh()
    // TODO: 跳转到首页 进行 toast 提示
    // router.push('/indexs')
  }

  const getAccountList = async () => {
    const data = await fetcher({
      url: `/api/account?mallId=${mallId}`,
      method: 'GET'
    })
    setAccountList(data)
  }

  useEffect(() => {
    getAccountList()
  }, [])

  return (
    <>
      <div className="flex w-full flex-col md:flex-nowrap gap-4">
        {accountList.length ? (
          <>
            <CheckAccount
              plateNo={plateNo}
              accountList={accountList}
              selected={selected}
              setSelected={setSelected}
            />

            <FullButton onClick={submit}>Submit</FullButton>
          </>
        ) : (
          <div className="text-center">No account</div>
        )}
      </div>
    </>
  )
}

export default SelectPlateNumber
