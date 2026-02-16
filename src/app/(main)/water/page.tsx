import { eachDayOfInterval, endOfWeek, format, startOfWeek } from 'date-fns'
import { redirect } from 'next/navigation'

import { PageTitle } from '@/components/page-title'
import { WaterTracker } from '@/components/water/water-tracker'
import { getWaterIntake, getWaterIntakeHistory } from '@/data/water-intake'
import { getSession } from '@/lib/auth'

async function Page() {
  const session = await getSession()
  if (!session) redirect('/')

  const today = new Date()
  const todayStr = format(today, 'yyyy-MM-dd')
  const weekStart = startOfWeek(today, { weekStartsOn: 1 })
  const weekEnd = endOfWeek(today, { weekStartsOn: 1 })
  const weekDates = eachDayOfInterval({ start: weekStart, end: weekEnd }).map((d) => format(d, 'yyyy-MM-dd'))

  const [waterAmount, weekData] = await Promise.all([
    getWaterIntake(session.user.id, todayStr),
    getWaterIntakeHistory(session.user.id, weekDates)
  ])

  const { waterGoal } = session.user

  return (
    <div className='flex flex-col gap-6'>
      <PageTitle title='Water Tracker' withBackButton />
      <WaterTracker initialAmount={waterAmount} initialGoal={waterGoal} date={todayStr} weekData={weekData} />
    </div>
  )
}

export default Page
