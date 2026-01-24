function Layout(props: LayoutProps<'/auth'>) {
  const { children } = props

  return <main className='flex min-h-svh items-center justify-center p-6'>{children}</main>
}

export default Layout
