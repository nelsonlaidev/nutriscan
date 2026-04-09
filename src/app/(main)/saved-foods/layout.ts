import type { Metadata } from 'next'

import { getTranslations } from 'next-intl/server'

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations()

  return {
    title: t('saved-meals.page-title'),
  }
}

export default async function Layout(props: LayoutProps<'/saved-foods'>) {
  const { children } = props

  return children
}
