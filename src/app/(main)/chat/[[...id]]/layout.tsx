import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Chat'
}

export default function Layout(props: LayoutProps<'/chat/[[...id]]'>) {
  const { children } = props

  return <>{children}</>
}
