export interface WeightData {
  date: string
  weight: number
}

export interface DayStatus {
  day: string // 'S', 'M', 'T', 'W', 'T', 'F', 'S'
  isComplete: boolean
  isToday?: boolean
}

export const weightHistory: WeightData[] = [
  { date: 'Jun 1', weight: 121 },
  { date: 'Jun 15', weight: 124 },
  { date: 'Jul 1', weight: 122 },
  { date: 'Jul 15', weight: 129 },
  { date: 'Aug 1', weight: 126 },
  { date: 'Aug 15', weight: 124 },
  { date: 'Sep 1', weight: 127 },
  { date: 'Sep 9', weight: 131.2 }, // Current point
  { date: 'Sep 15', weight: 128 },
  { date: 'Oct 1', weight: 132 },
  { date: 'Oct 15', weight: 134 },
  { date: 'Nov 1', weight: 136 }
]

export const currentWeight = {
  current: 132.1,
  goal: 140,
  start: 120
}

export const streakData = {
  currentStreak: 21,
  weeklyProgress: [
    { day: 'S', isComplete: true },
    { day: 'M', isComplete: true },
    { day: 'T', isComplete: false, isToday: true },
    { day: 'W', isComplete: false },
    { day: 'T', isComplete: false },
    { day: 'F', isComplete: false },
    { day: 'S', isComplete: false }
  ] as DayStatus[]
}

export const caloriesData = {
  average: 2861,
  trend: 90 // +90%
}
