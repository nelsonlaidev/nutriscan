import { format } from 'date-fns'
import { redirect } from 'next/navigation'

import { PageTitle } from '@/components/page-title'
import { WaterTracker } from '@/components/water/water-tracker'
import { getWaterIntake } from '@/data/water-intake'
import { getSession } from '@/lib/auth'

async function Page() {
  const session = await getSession()
  if (!session) redirect('/')

  const today = format(new Date(), 'yyyy-MM-dd')
  const waterAmount = await getWaterIntake(session.user.id, today)
  const { waterGoal } = session.user

  return (
    <div className='flex flex-col gap-6'>
      <PageTitle title='Water Tracker' withBackButton />
      <WaterTracker initialAmount={waterAmount} initialGoal={waterGoal} date={today} />
    </div>
  )
}

export default Page
