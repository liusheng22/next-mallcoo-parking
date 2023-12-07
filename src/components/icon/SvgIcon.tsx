import Image from 'next/image'
import { FC } from 'react'

interface HomeIconProps {
  alt: string
  src: string
  ariaLabel: string
  width: 20
  height: 20
}

const HomeIcon: FC<HomeIconProps> = ({
  src,
  alt,
  ariaLabel,
  width,
  height
}) => {
  return (
    <Image
      alt={alt}
      aria-label={ariaLabel}
      src={src}
      width={width}
      height={height}
    />
  )
}

export default HomeIcon
