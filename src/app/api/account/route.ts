import { failed, success } from '@/helper/response'
import { AccountItem } from '@/types/ui'
import { NextRequest } from 'next/server'
import { getQueryValue } from 'utils/api-route'
import { cosDb } from 'utils/db'

export async function GET(req: NextRequest) {
  const mallId = getQueryValue(req, 'mallId')
  if (!mallId) {
    return failed('mallId is required')
  }
  const list: AccountItem[] =
    (await cosDb.getObjectDefault(`.mallWithAccount.${mallId}.list`)) || []
  const data = list.filter(
    (item: AccountItem) => !item.isSelected && !item.isPaid
  )
  return success(data)
}

export async function POST(req: NextRequest) {
  const { selected, mallId }: { selected: string[]; mallId: string } =
    await req.json()

  const list: AccountItem[] =
    (await cosDb.getObjectDefault(`.mallWithAccount.${mallId}.list`)) || []
  // list 筛选出 已经选择的 selected
  const selectedList = list.filter((item: AccountItem) =>
    selected.includes(item.openId)
  )

  // 重新设置 isSelected
  selectedList.forEach(async (item: AccountItem) => {
    const { id } = item
    const idx =
      (await cosDb.getIndex(`.mallWithAccount.${mallId}.list`, id)) || 0
    cosDb.push(`.mallWithAccount.${mallId}.list.${idx}.isSelected`, true, true)
  })

  return success(selected)
}
