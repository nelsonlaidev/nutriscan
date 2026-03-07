import { redirect } from 'next/navigation'

import { Navbar } from '@/components/navbar'
import { Providers } from '@/components/providers'
import { getSession } from '@/lib/auth'

export default async function Layout(props: LayoutProps<'/'>) {
  const { children } = props
  const session = await getSession()

  if (!session) {
    redirect('/')
  }

  return (
    <Providers session={session}>
      {children}
      <Navbar />
    </Providers>
  )
}
