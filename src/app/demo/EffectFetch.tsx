'use client'
import { FC, useEffect, useState } from 'react'

const EffectFetch: FC = () => {
  const [data, setData] = useState(null)

  useEffect(() => {
    const fetchData = async () => {
      const res = await fetch('https://www.fastmock.site/mock/6345ad1b8161c2b06ef04f23db6c1b1e/mock/info')
      const { data } = await res.json()
      setData(data)
    }
    fetchData()
  }, [])

  return <div>
    fetch: {JSON.stringify(data)}
  </div>
}

export default EffectFetch

