import HomeSvg from '@/static/home.svg'
import Image from 'next/image'
import { FC } from 'react'

interface HomeIconProps {
  width?: 20
  height?: 20
}

const HomeIcon: FC<HomeIconProps> = ({ width, height }) => {
  return <Image alt="" src={HomeSvg} width={width} height={height} />
}

export default HomeIcon
