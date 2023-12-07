// 封装 res 返回
import { NextApiResponse } from 'next'

/**
 * 返回成功
 * @param res
 * @param data
 */
export const success = (res: NextApiResponse, data?: any) => {
  data = data || {}
  res.status(200).json({
    code: 200,
    data
  })
}

/**
 * 返回失败
 * @param res
 * @param data
 */
export const failed = (res: NextApiResponse, data?: any) => {
  data = data || {}
  res.status(400).json({
    code: 400,
    data
  })
}