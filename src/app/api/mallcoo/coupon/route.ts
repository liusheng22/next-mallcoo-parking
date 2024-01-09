import { fetchGetNotAboutToExpireCoupon } from '@/helper/payment/coupon'
import { success } from '@/helper/response'

// 查询已存在的优惠券
export async function GET() {
  const list = await fetchGetNotAboutToExpireCoupon()
  return success(list)
}
