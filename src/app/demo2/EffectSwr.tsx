'use client'

import { FC, useState, useEffect, createElement } from 'react'
import { useSwrFetch } from '@/app/composables/use-swr-fetch'

const EffectSwr: FC = () => {
  const [data, setData] = useState(null)

  const { data: resData, error } = useSwrFetch({
    shouldFetch: true,
    defaultData: null,
    url: 'https://www.fastmock.site/mock/6345ad1b8161c2b06ef04f23db6c1b1e/mock/info'
  })
  const { data: dataInfo } = resData || {}
  if (error) { return (createElement('div', null, 'Loading...')) }

  useEffect(() => {
    setData(dataInfo)
  }, [dataInfo])
  
  return <div>
    swr: {JSON.stringify(data)}
  </div>
}

export default EffectSwr
