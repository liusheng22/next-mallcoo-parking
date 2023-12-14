'use client'

import { Card, CardBody } from '@nextui-org/react'
import InputPlateNo from 'components/ui/InputPlateNo'
import { useRouter } from 'next/navigation'
import { FC } from 'react'

const page: FC = () => {
  const router = useRouter()

  const toAutoPaymentLink = (query: string) => {
    router.push(`/auto-payment/${query}`)
  }

  return (
    <Card>
      <CardBody>
        <InputPlateNo toLinkQuery={toAutoPaymentLink} />
      </CardBody>
    </Card>
  )
}

export default page
