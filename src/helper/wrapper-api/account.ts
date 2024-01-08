import { fetcher } from 'app/composables/use-fetcher'

// 账户列表
export const getAccountListApi = async (mallId: string) => {
  const accountList = await fetcher({
    url: `/api/account?mallId=${mallId}`,
    method: 'GET'
  })
  console.log('账户列表 accountList =>', accountList)

  return accountList || []
}
