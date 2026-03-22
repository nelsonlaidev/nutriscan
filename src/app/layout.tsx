import '../orpc/server'
import '../styles/globals.css'
import 'streamdown/styles.css'

import type { Metadata, Viewport } from 'next'

import { Geist } from 'next/font/google'
import { NextIntlClientProvider } from 'next-intl'
import { getLocale, getMessages } from 'next-intl/server'

import { Providers } from '@/components/providers'
import { Toaster } from '@/components/ui/sonner'

const geistSans = Geist({
  subsets: ['latin'],
})

export const metadata: Metadata = {
  title: {
    default: 'NutriScan',
    template: '%s | NutriScan',
  },
  description: 'Track your nutrition, reach your goals',
  icons: {
    icon: '/favicon.ico',
  },
  appleWebApp: {
    capable: true,
    statusBarStyle: 'default',
    title: 'NutriScan',
  },
}

export const viewport: Viewport = {
  themeColor: '#ffffff',
}

type LayoutProps = {
  children: React.ReactNode
}

export default async function Layout(props: LayoutProps) {
  const { children } = props
  const locale = await getLocale()
  const messages = await getMessages()

  return (
    <html lang={locale} className={geistSans.className} data-scroll-behavior='smooth' suppressHydrationWarning>
      <body>
        <Providers>
          <NextIntlClientProvider messages={messages}>
            <div className='relative mx-auto h-full max-w-240 overflow-x-clip min-[60rem]:border-x'>{children}</div>
            <Toaster toastOptions={{ duration: 2500 }} position='top-center' visibleToasts={5} expand />
          </NextIntlClientProvider>
        </Providers>
      </body>
    </html>
  )
}
