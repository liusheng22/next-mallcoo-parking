'use client'

import { Card, CardBody, Tab, Tabs } from '@nextui-org/react'
import InputPlateNo from 'components/ui/InputPlateNo'
import { notFound, usePathname, useRouter } from 'next/navigation'
import { FC } from 'react'

const pathList = ['/', '/home', '/account']

const page: FC = () => {
  const router = useRouter()
  const pathname = usePathname() || '/home'

  const toAutoPaymentLink = (query: string) => {
    router.push(`/auto-payment/${query}`)
  }
  const toHandPaymentLink = (query: string) => {
    router.push(`/hand-payment/${query}`)
  }

  if (!pathList.includes(pathname)) {
    notFound()
  }

  return (
    <Tabs aria-label="Options" fullWidth={true} selectedKey={pathname}>
      <Tab key="/home" title="首页" href="/home">
        <Card>
          <CardBody>
            <InputPlateNo toLinkQuery={toAutoPaymentLink} />
          </CardBody>
        </Card>
      </Tab>
      <Tab key="/account" title="账号" href="/account">
        <Card>
          <CardBody>
            <InputPlateNo toLinkQuery={toHandPaymentLink} />
          </CardBody>
        </Card>
      </Tab>
    </Tabs>
  )
}

export default page
