import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Sign Up'
}

export default function Layout(props: LayoutProps<'/auth/sign-up'>) {
  const { children } = props

  return <>{children}</>
}
