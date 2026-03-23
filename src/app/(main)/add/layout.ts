import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Add Food',
}

export default async function Layout(props: LayoutProps<'/add'>) {
  const { children } = props

  return children
}
