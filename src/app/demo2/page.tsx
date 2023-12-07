import { Button } from '@nextui-org/react'
import axios from 'axios'
import { FC, useState } from 'react'
import useSWR from 'swr'
import Btn from './btn'
import EffectFetch from './EffectFetch'
import EffectSwr from './EffectSwr'

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