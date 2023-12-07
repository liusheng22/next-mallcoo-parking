'use client'

import { Button } from '@nextui-org/react'
import HomeIcon from 'components/icon/HomeIcon'
import { useRouter } from 'next/navigation'
import { FC } from 'react'

const BackHome: FC = () => {
  const router = useRouter()

  const toBackHome = () => {
    router.push('/')
  }
  return (
    <div className="absolute right-10 bottom-10">
      <Button isIconOnly color="warning" aria-label="Home" onClick={toBackHome}>
        <HomeIcon />
      </Button>
    </div>
  )
}

export default BackHome
