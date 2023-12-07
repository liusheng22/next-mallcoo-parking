import { FC } from 'react'

interface notFoundProps {
  [key: string]: any
}

const notFound: FC<notFoundProps> = ({}) => {
  return <>
    <div className='text-center'>hi~ you are lost</div>
  </>
}

export default notFound