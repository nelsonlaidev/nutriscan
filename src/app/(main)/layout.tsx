import Navbar from '@/components/navbar'

function Layout(props: LayoutProps<'/'>) {
  const { children } = props

  return (
    <main className='p-6'>
      {children}
      <Navbar />
    </main>
  )
}

export default Layout
