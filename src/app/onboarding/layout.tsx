import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Onboarding'
}

export default function Layout(props: LayoutProps<'/onboarding'>) {
  const { children } = props

  return <>{children}</>
}
