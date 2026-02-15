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
      <main className='px-4 pt-6 pb-20'>
        {children}
        <Navbar />
      </main>
    </Providers>
  )
}

export default Layout
