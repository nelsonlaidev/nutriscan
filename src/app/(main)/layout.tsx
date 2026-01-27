import Navbar from '@/components/navbar'

function Layout(props: LayoutProps<'/'>) {
  const { children } = props

  return (
    <>
      {children}
      <Navbar />
    </>
  )
}

export default Layout
