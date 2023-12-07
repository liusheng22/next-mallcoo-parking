'use client'

import { Card, CardBody } from '@nextui-org/react'
import { fetcher } from 'app/composables/use-fetcher'
import { useRouter } from 'next/navigation'
import { FC } from 'react'
import FullButton from './FullButton'

interface ExistAutoPaymentProps {
  plateNo: string
}

const ExistAutoPayment: FC<ExistAutoPaymentProps> = ({ plateNo }) => {
  const router = useRouter()

  const closePayment = async () => {
    console.log('closePayment')
    await fetcher({
      url: `/api/payment-account?plateNo=${plateNo}`,
      method: 'DELETE'
    })

    router.refresh()
  }

  return (
    <>
      <Card fullWidth={true} className="my-5">
        <CardBody>
          <p className="text-label font-bold text-lg">{plateNo}</p>
          {/* 该车辆已经存在自动缴费配置 */}
          <p className="text-center">
            The PlateNo already exists automatic payment configuration
          </p>
        </CardBody>
      </Card>

      <FullButton onClick={closePayment}>Close Auto Payment</FullButton>
    </>
  )
}

export default ExistAutoPayment
