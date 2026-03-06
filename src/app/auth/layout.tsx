function Layout(props: LayoutProps<'/auth'>) {
  const { children } = props

  return <main className='flex min-h-dvh items-center justify-center p-6'>{children}</main>
}

export default Layout
