import { mallList } from '@/constants'
import { MallItem } from '@/types/ui'
import { Input, Select, SelectItem } from '@nextui-org/react'
import { fetcher } from 'app/composables/use-fetcher'
import { FC, useState } from 'react'
import FullButton from './FullButton'

interface Props {
  toLinkQuery: (query: string) => void
}

const InputPlateNo: FC<Props> = (props) => {
  const [defaultMallConfig] = mallList
  const [mallId, setMallId] = useState(new Set([defaultMallConfig.mallId]))
  const [plateNo, setPlateNo] = useState('')
  const [mallConfig, setMallConfig] = useState(defaultMallConfig)

  const setMallInfo = () => {
    const mall = mallList.find(
      (mall) => mall.mallId === [...mallId][0]
    ) as MallItem
    setMallConfig(mall || {})
  }

  const toDetail = async () => {
    // const id = mallId.values().next().value
    const mallIdVal = [...mallId][0]
    const { parkId, projectType } = mallConfig

    await fetcher({
      url: `/api/task?mallId=${mallIdVal}&parkId=${parkId}&projectType=${projectType}`
    })

    props.toLinkQuery(`${mallIdVal}/${plateNo}`)
  }

  return (
    <div className="flex w-full flex-wrap md:flex-nowrap gap-4">
      <Select
        className="max-w-xs"
        label="Select a mall"
        selectedKeys={mallId}
        onSelectionChange={(mallId: any) => {
          setMallId(mallId)
          setMallInfo()
        }}
      >
        {mallList.map((mall) => (
          <SelectItem key={mall.mallId} value={mall.mallId}>
            {mall.name}
          </SelectItem>
        ))}
      </Select>

      <Input
        type="text"
        label="Plate Number"
        placeholder="Input your plate number"
        isClearable
        onValueChange={(value) => setPlateNo(value)}
      />

      <FullButton disabled={!mallId || !plateNo} onClick={toDetail}>
        Click
      </FullButton>
    </div>
  )
}

export default InputPlateNo
