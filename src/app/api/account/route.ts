import { failed, success } from '@/helper/response'
import { AccountItem } from '@/types/ui'
import { db } from '@/utils/db'
import { NextRequest } from 'next/server'
import { getQueryKey } from 'utils/api-route'

export async function GET(req: NextRequest) {
  const mallId = getQueryKey(req, 'mallId')
  if (!mallId) {
    return failed('mallId is required')
  }
  const list: AccountItem[] =
    (await db.getObjectDefault(`.mallWithAccount.${mallId}.list`)) || []
  const data = list.filter(
    (item: AccountItem) => !item.isSelected && !item.isPaid
  )
  return success(data)
}

export async function POST(req: NextRequest) {
  const { selected, mallId }: { selected: string[]; mallId: string } =
    await req.json()

  const list: AccountItem[] =
    (await db.getObjectDefault(`.mallWithAccount.${mallId}.list`)) || []
  // list 筛选出 已经选择的 selected
  const selectedList = list.filter((item: AccountItem) =>
    selected.includes(item.openId)
  )

  // 重新设置 isSelected
  selectedList.forEach(async (item: AccountItem) => {
    const { id } = item
    const idx = (await db.getIndex(`.mallWithAccount.${mallId}.list`, id)) || 0
    db.push(`.mallWithAccount.${mallId}.list.${idx}.isSelected`, true, true)
  })

  return success(selected)
}
