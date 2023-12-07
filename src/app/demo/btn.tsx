'use client'

import { Button } from '@nextui-org/react'
import { FC } from 'react'

interface btProps {
  children: React.ReactNode
}

const bt: FC<btProps> = ({ children }) => {
  return <div>
    <Button>1123</Button>
  </div>
}

export default bt