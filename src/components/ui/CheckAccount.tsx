import { AccountItem } from '@/types/ui'
import { Checkbox, CheckboxGroup } from '@nextui-org/react'
import { FC } from 'react'

interface CheckAccountProps {
  plateNo: string
  accountList: AccountItem[]
  selected: string[]
  setSelected: (value: string[]) => void
}

const CheckAccount: FC<CheckAccountProps> = (props) => {
  const { plateNo, accountList = [], selected, setSelected } = props

  return (
    <CheckboxGroup
      label={`${plateNo}: Select pay account`}
      value={selected}
      onValueChange={setSelected}
    >
      {accountList.map((item: AccountItem, index: number) => {
        return (
          <Checkbox key={index} value={item.name}>
            {item.name}
          </Checkbox>
        )
      })}
    </CheckboxGroup>
  )
  // return (
  //   <CheckboxGroup
  //     label={`${plateNo}: Select pay account`}
  //     value={selected}
  //     onValueChange={setSelected}
  //   >
  //     {accountList.map((item: AccountItem, index: number) => {
  //       return (
  //         <Checkbox key={index} value={item.openId}>
  //           {item.name}
  //         </Checkbox>
  //       )
  //     })}
  //   </CheckboxGroup>
  // )
}

export default CheckAccount
