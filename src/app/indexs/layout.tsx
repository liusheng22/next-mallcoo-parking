'use client'

import { Tab, Tabs } from '@nextui-org/react'
import { FC } from 'react'

interface LayoutProps {
  auto: React.ReactNode
  hand: React.ReactNode
}

const Layout: FC<LayoutProps> = (props) => {
  return (
    <Tabs aria-label="Options" fullWidth={true}>
      <Tab key="auto" title="自动缴费">
        {props.auto}
      </Tab>
      <Tab key="hand" title="手动缴费">
        {props.hand}
      </Tab>
    </Tabs>
  )
}

export default Layout
