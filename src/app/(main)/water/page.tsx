import { redirect } from 'next/navigation'
import { getTranslations } from 'next-intl/server'

import { BackButton } from '@/components/back-button'
import { MainLayout } from '@/components/main-layout'
import { WaterTracker } from '@/components/water/water-tracker'
import { getWaterChartData } from '@/data/progress'
import { getWaterEntries } from '@/data/water'
import { getSession } from '@/lib/auth'
import { getDateRange } from '@/lib/utils'

async function Page() {
  const session = await getSession()
  if (!session) redirect('/')

  const { waterGoal } = session.user

  const t = await getTranslations()

  const dateRange = getDateRange('weekly')

  const [entries, weekData] = await Promise.all([
    getWaterEntries(session.user.id),
    getWaterChartData(session.user.id, dateRange)
  ])

  return (
    <MainLayout title={t('water.page-title')} leftTitleButton={<BackButton />}>
      <WaterTracker initialGoal={waterGoal} weekData={weekData} initialEntries={entries} />
    </MainLayout>
  )
}

export default Page
