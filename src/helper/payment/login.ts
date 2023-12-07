import { PayInfo } from '@/types/ui'
import mallcooFetcher from 'utils/wrapper-mallcoo'

// 获取token
export const fetchLoginForThirdV2: any = async (query: PayInfo) => {
  const { openId, mallId } = query
  const url = 'https://m.mallcoo.cn/a/liteapp/api/identitys/LoginForThirdV2'

  const params = {
    MallID: mallId,
    Code: '',
    OpenID: openId,
    NotVCodeAndGraphicVCode: true,
    SNSType: 8
  }

  const [, data] = await mallcooFetcher({
    url,
    method: 'POST',
    data: params
  })

  return data
}
