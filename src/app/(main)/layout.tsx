import { redirect } from 'next/navigation'

import { Navbar } from '@/components/navbar'
import { Providers } from '@/components/providers'
import { getSession } from '@/lib/auth'

async function Layout(props: LayoutProps<'/'>) {
  const { children } = props
  const session = await getSession()

  if (!session) {
    redirect('/')
  }

  return (
    <Providers session={session}>
      <main className='p-6'>
        {children}
        <Navbar />
      </main>
    </Providers>
  )
}

export default Layout
