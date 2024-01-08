import { fetcher } from 'app/composables/use-fetcher'

export const getPlateNoInfo = async (plateNo: string) => {
  const data = await fetcher({
    url: `/api/payment-account?plateNo=${plateNo}`,
    method: 'GET'
  })
  console.log('车辆信息 data =>', data)

  return data || []
}

// 获取停车信息
export const getParkInfoApi = async (queryStr: string) => {
  console.log('getParkInfoApi queryStr =>', queryStr)
  const parkInfo = await fetcher({
    url: `/api/mallcoo?${queryStr}`,
    method: 'GET'
  })
  console.log('停车信息 parkInfo =>', parkInfo)

  return parkInfo || {}
}
