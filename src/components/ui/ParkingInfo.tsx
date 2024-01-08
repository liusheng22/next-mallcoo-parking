'use client'

import { Card, CardBody, CardHeader, Image } from '@nextui-org/react'
import PosterImg from 'images/sports_car.png'
import { FC } from 'react'

interface ParkingInfoProps {
  plateNo: string
  EntryTime?: string
  ParkName?: string
  ParkingMinutes: number
  ParkingFee: number
  NeedPayAmount: number
}

const ParkingInfo: FC<ParkingInfoProps> = ({
  plateNo,
  EntryTime,
  ParkName,
  ParkingMinutes,
  ParkingFee,
  NeedPayAmount
}) => {
  return (
    <Card className="py-2 mt-4">
      <CardHeader className="pb-0 pt-2 px-4 flex-col items-start">
        <h4 className="font-bold text-large">{plateNo}</h4>
        <p className="text-tiny uppercase font-bold">{ParkName}</p>
        <small className="text-default-500">入场时间：{EntryTime}</small>
        <small className="text-default-500">停车时长：{ParkingMinutes}</small>
        <small className="text-default-500">停车费用：{ParkingFee}</small>
        <small className="text-default-500">需要支付：{NeedPayAmount}</small>
      </CardHeader>

      <CardBody className="overflow-visible py-2">
        <Image
          alt=""
          className="object-cover rounded-xl w-full"
          src={PosterImg.src}
          width="100%"
        />
      </CardBody>
    </Card>
  )
}

export default ParkingInfo
