import Providers from '@/components/Providers'
import BackHome from 'components/layout/BackHome'
import { Inter } from 'next/font/google'
import './globals.css'
const inter = Inter({ subsets: ['latin'] })

export default function RootLayout({
  children
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="zh" className={`${inter.className} px-5 dark`}>
      <body className="min-h-screen">
        <Providers>
          <main>
            {children}

            {/* 返回首页 */}
            <BackHome />
          </main>
        </Providers>
      </body>
    </html>
  )
}
