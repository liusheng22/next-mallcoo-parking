'use client'

import { fetcher } from '@/app/composables/use-fetcher'
import { AccountItem } from '@/types/ui'
import { Slider } from '@nextui-org/react'
import dayjs from 'dayjs'
import { useRouter } from 'next/navigation'
import { FC, useEffect, useRef, useState } from 'react'
import Chip from './Chip'
import ConfirmModal from './ConfirmModal'
import FullButton from './FullButton'
import PaymentProgress from './PaymentProgress'

interface UsingPayAccountProps {
  plateNo: string
  usingList: AccountItem[]
}

interface MarksItem {
  value: number
  label: string
}

const UsingPayAccount: FC<UsingPayAccountProps> = (props) => {
  const router = useRouter()
  const { plateNo, usingList = [] } = props
  const [defaultValue, setDefaultValue] = useState(0)
  const [step, setStep] = useState(0)
  const [usingAccountList, setUsingAccountList] = useState<MarksItem[]>([])

  const modalRef = useRef<any>()

  useEffect(() => {
    const step = usingList.length > 1 ? 1 / (usingList.length - 1) : 1
    const list = usingList.map((item: AccountItem, index: number) => {
      const { name, usedTime } = item
      const time = usedTime ? `${dayjs(usedTime).format('hh:mm')}` : ''
      const label = time ? `${time}(${name})` : name
      const currStep = index * step
      if (usedTime) {
        setDefaultValue(currStep)
      }

      return {
        value: index * step,
        label
      }
    })
    setUsingAccountList(list)

    setStep(step)
  }, [usingList])

  const submit = async () => {
    console.log('submit', plateNo)
    modalRef.current.onOpen()
  }

  const confirmDelHandle = async () => {
    fetcher({
      url: `/api/payment-account?plateNo=${plateNo}`,
      method: 'DELETE'
    })

    router.push('/')
  }

  return (
    <div>
      <div className="mt-4 mb-12">
        {/* TODO: 可以服务端渲染 */}
        <Slider
          label="Payment progress"
          renderLabel={({ children, ...props }) => (
            <label {...props} className="text-medium flex gap-2 items-center">
              {/* <span className='text-emerald-400' >{plateNo}</span> */}
              <Chip plateNo={plateNo} />
              {children}
            </label>
          )}
          showTooltip={true}
          isDisabled={false}
          formatOptions={{ style: 'percent' }}
          step={step}
          maxValue={1}
          minValue={0}
          marks={usingAccountList}
          value={defaultValue}
          tooltipProps={{
            isOpen: false,
            placement: 'top'
          }}
        />
      </div>

      <PaymentProgress usingList={usingList} />

      <FullButton onClick={submit}>Close payment</FullButton>

      <ConfirmModal
        ref={modalRef}
        title={plateNo}
        body="Are you sure you want to close the automatic payment?"
        confirmDelHandle={confirmDelHandle}
      />
    </div>
  )
}

export default UsingPayAccount
