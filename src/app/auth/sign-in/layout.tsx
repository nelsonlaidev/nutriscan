import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Sign In'
}

export default function Layout(props: LayoutProps<'/auth/sign-in'>) {
  const { children } = props

  return <>{children}</>
}
