import type { Metadata } from 'next'
import type { Meal } from '@/lib/constants'
import type { ListFoodByCategoryInput } from '@/orpc/client'

import { notFound, redirect } from 'next/navigation'
import { getTranslations } from 'next-intl/server'

import { BackButton } from '@/components/back-button'
import { MainLayout } from '@/components/main-layout'
import { getSession } from '@/lib/auth'
import { MEALS_SET } from '@/lib/constants'
import { getQueryClient, HydrateClient } from '@/lib/query/hydration'
import { getDayRange } from '@/lib/utils'
import { orpc } from '@/orpc/client'

import { Header } from './header'
import { List } from './list'
import { categoryCache } from './search-params'

const CATEGORY_TITLES: Record<string, string> = {
  breakfast: 'Breakfast',
  lunch: 'Lunch',
  dinner: 'Dinner',
  snacks: 'Snacks',
}

export async function generateMetadata(props: PageProps<'/meals/[category]'>): Promise<Metadata> {
  const { category } = await props.params
  return {
    title: CATEGORY_TITLES[category] ?? 'Meal',
  }
}

export default async function Page(props: PageProps<'/meals/[category]'>) {
  const { params, searchParams } = props
  const { category } = await params
  const { date } = await categoryCache.parse(searchParams)

  if (!MEALS_SET.has(category)) {
    notFound()
  }

  const mealCategory = category as Meal

  const session = await getSession()
  if (!session) redirect('/')

  const t = await getTranslations()
  const dayRange = getDayRange(date)

  const queryClient = getQueryClient()

  const input: ListFoodByCategoryInput = { ...dayRange, category: mealCategory }

  await queryClient.prefetchQuery(orpc.food.listByCategory.queryOptions({ input }))

  const mealName = t(`meals.${mealCategory}`)

  return (
    <MainLayout title={mealName} leftTitleButton={<BackButton />}>
      <div className='space-y-6'>
        <HydrateClient client={queryClient}>
          <Header input={input} />
          <List input={input} />
        </HydrateClient>
      </div>
    </MainLayout>
  )
}
