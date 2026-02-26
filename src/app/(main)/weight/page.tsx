import { redirect } from 'next/navigation'
import { getTranslations } from 'next-intl/server'

import { BackButton } from '@/components/back-button'
import { MainLayout } from '@/components/main-layout'
import { WeightTracker } from '@/components/weight/weight-tracker'
import { getLatestWeight, getWeightEntries } from '@/data/weight'
import { getSession } from '@/lib/auth'

async function Page() {
  const session = await getSession()
  if (!session) redirect('/')

  const t = await getTranslations()

  const [latestWeight, entries] = await Promise.all([
    getLatestWeight(session.user.id),
    getWeightEntries(session.user.id)
  ])

  const currentWeight = latestWeight?.weight ?? session.user.currentWeight
  const { startingWeight, goalWeight } = session.user

  return (
    <MainLayout title={t('weight.page-title')} leftTitleButton={<BackButton />}>
      <WeightTracker
        currentWeight={currentWeight}
        startingWeight={startingWeight}
        goalWeight={goalWeight}
        initialEntries={entries}
      />
    </MainLayout>
  )
}

export default Page
