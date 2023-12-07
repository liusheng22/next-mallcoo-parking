'use client'

import { Card, CardBody } from '@nextui-org/react'
import { FC } from 'react'

interface NotPlateNoInfoProps {
  plateNo: string
}

const NotPlateNoInfo: FC<NotPlateNoInfoProps> = ({ plateNo }) => {
  return (
    <>
      <Card fullWidth={true} className="my-5">
        <CardBody>
          <p className="text-label font-bold text-lg">{plateNo}</p>
          <p className="text-center">Not found plateNo info</p>
        </CardBody>
      </Card>
    </>
  )
}

export default NotPlateNoInfo
