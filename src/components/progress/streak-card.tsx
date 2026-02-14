'use client'

import { CheckCircleIcon, FireIcon } from '@phosphor-icons/react'

import { Card, CardContent } from '@/components/ui/card'
import { streakData } from '@/lib/mock/progress-data'
import { cn } from '@/lib/utils'

export function StreakCard() {
  const { currentStreak, weeklyProgress } = streakData

  return (
    <Card className='size-full overflow-hidden rounded-3xl border-none bg-white shadow-sm'>
      <CardContent className='flex h-full flex-col items-center justify-between space-y-6 p-6'>
        <div className='flex flex-col items-center space-y-2'>
          <div className='relative'>
            {/* Visual Flame Effect */}
            <div className='absolute inset-0 scale-150 transform animate-pulse rounded-full bg-orange-100 opacity-50 blur-xl' />
            <FireIcon className='relative z-10 size-12 text-orange-500' weight='fill' />
          </div>
          <div className='text-center'>
            <span className='block text-3xl leading-none font-bold text-orange-500'>{currentStreak}</span>
            <span className='text-sm font-medium text-orange-400'>Day Streak</span>
          </div>
        </div>

        {/* Weekly Indicators */}
        <div className='flex w-full justify-between px-1'>
          {weeklyProgress.map((day, index) => (
            <div key={index} className='flex flex-col items-center gap-1.5'>
              <span className='text-[10px] font-bold text-gray-400 uppercase'>{day.day}</span>
              <div className='relative'>
                {day.isComplete ? (
                  <CheckCircleIcon className='size-5 rounded-full bg-white text-orange-500' weight='fill' />
                ) : (
                  <div
                    className={cn(
                      'size-5 rounded-full border-2',
                      day.isToday ? 'border-orange-200 bg-orange-50' : 'border-gray-100 bg-gray-50'
                    )}
                  />
                )}
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
