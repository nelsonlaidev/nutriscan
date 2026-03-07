import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Profile'
}

export default function Layout(props: LayoutProps<'/profile'>) {
  const { children } = props

  return <>{children}</>
}
