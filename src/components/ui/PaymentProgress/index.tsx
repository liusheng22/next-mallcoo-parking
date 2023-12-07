import PaymentSvg from '@/static/payment.svg'
import WaitingSvg from '@/static/waiting.svg'
import { AccountItem } from '@/types/ui'
import { cn } from '@/utils/clsx'
import Image from 'next/image'
import { FC } from 'react'
import styles from './index.module.css'

interface PaymentProgressProps {
  usingList: AccountItem[]
}

const PaymentProgress: FC<PaymentProgressProps> = ({ usingList }) => {
  return (
    <>
      <ul className="flex-col">
        {usingList.map((item, index) => {
          return (
            <li
              className={cn(
                'h-16 flex',
                styles.line,
                item.isPaid ? styles.paid : ''
              )}
              key={index}
            >
              <div>
                {item.isPaid ? (
                  <Image
                    style={{ color: '#fff', fill: '#fff' }}
                    alt=""
                    src={PaymentSvg}
                    width={20}
                    height={20}
                  />
                ) : (
                  <Image alt="" src={WaitingSvg} width={20} height={20} />
                )}
              </div>
              <div className="flex-col ml-4">
                <div>{item.name}</div>
                <div>{item.isPaid ? item.time : '代缴费ing...'}</div>
              </div>
            </li>
          )
        })}
      </ul>
    </>
  )
}

export default PaymentProgress
