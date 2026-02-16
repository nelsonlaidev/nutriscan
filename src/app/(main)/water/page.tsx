import { eachDayOfInterval, endOfWeek, format, startOfWeek, subDays } from 'date-fns'
import { redirect } from 'next/navigation'

import { PageContainer } from '@/components/page-container'
import { PageTitle } from '@/components/page-title'
import { WaterTracker } from '@/components/water/water-tracker'
import { getWaterEntries, getWaterTotalsByDate } from '@/data/water-entries'
import { getSession } from '@/lib/auth'

async function Page() {
  const session = await getSession()
  if (!session) redirect('/')

  const today = new Date()
  const todayStr = format(today, 'yyyy-MM-dd')
  const weekStart = startOfWeek(today, { weekStartsOn: 1 })
  const weekEnd = endOfWeek(today, { weekStartsOn: 1 })
  const weekDates = eachDayOfInterval({ start: weekStart, end: weekEnd }).map((d) => format(d, 'yyyy-MM-dd'))

  // Last 7 days for entry history
  const historyDates = Array.from({ length: 7 }, (_, i) => format(subDays(today, i), 'yyyy-MM-dd'))

  const [entries, weekData] = await Promise.all([
    getWaterEntries(session.user.id, historyDates),
    getWaterTotalsByDate(session.user.id, weekDates)
  ])

  const { waterGoal } = session.user

  return (
    <PageContainer>
      <PageTitle title='Water Tracker' withBackButton />
      <WaterTracker initialGoal={waterGoal} date={todayStr} weekData={weekData} initialEntries={entries} />
    </PageContainer>
  )
}

export default Page
