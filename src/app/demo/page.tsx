import { FC } from 'react'
import EffectFetch from './EffectFetch'
import EffectSwr from './EffectSwr'
import Btn from './btn'

interface pageProps {
  
}

const page: FC<pageProps> = () => {
  return <div>
    <div>page demo 11</div>
    <Btn>123</Btn>
    <EffectFetch />
    <EffectSwr />
  </div>
}

export default page