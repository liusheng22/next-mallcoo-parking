import { redirect } from 'next/navigation'
import { FC } from 'react'

const page: FC = () => {
  redirect('/home')
}

export default page