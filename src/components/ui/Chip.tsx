'use client'

import { Chip } from '@nextui-org/react'
import { FC } from 'react'

interface chipProps {
  plateNo: string
}

const chip: FC<chipProps> = ({ plateNo }) => {
  return <Chip color="primary" variant="dot">{plateNo}</Chip>
}

export default chip