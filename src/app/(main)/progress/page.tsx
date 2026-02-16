import { getTranslations } from 'next-intl/server'

import { PageTitle } from '@/components/page-title'
import { CaloriesCard } from '@/components/progress/calories-card'
import { StreakCard } from '@/components/progress/streak-card'
import { WeightCard } from '@/components/progress/weight-card'
import { WeightChart } from '@/components/progress/weight-chart'

export default async function ProgressPage() {
  const t = await getTranslations()

  return (
    <div className='space-y-6'>
      <PageTitle title={t('progress.page-title')} />

      <div className='grid grid-cols-1 gap-6 md:grid-cols-2'>
        <div className='w-full'>
          <WeightCard />
        </div>
        <div className='size-full'>
          <StreakCard />
        </div>
      </div>

      <WeightChart />
      <CaloriesCard />
    </div>
  )
}
