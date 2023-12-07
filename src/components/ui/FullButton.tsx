'use client'

import { Button, Link } from '@nextui-org/react'
import { FC } from 'react'

interface FullButtonProps {
  href?: string
  children?: React.ReactNode
  disabled?: boolean
  onClick?: () => void
}

const FullButton: FC<FullButtonProps> = ({
  href,
  children,
  disabled,
  onClick
}) => {
  return (
    <Button
      href={href}
      as={href ? Link : Button}
      isDisabled={disabled}
      fullWidth
      onClick={onClick}
      className="my-0.5 bg-gradient-to-tr from-pink-500 to-yellow-500 text-white shadow-lg"
    >
      {children}
    </Button>
  )
}

export default FullButton
