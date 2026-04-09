'use client'

import type { ListFoodByCategoryInput } from '@/orpc/client'

import { CaretRightIcon } from '@phosphor-icons/react/ssr'
import Image from 'next/image'
import Link from 'next/link'
import { useTranslations } from 'next-intl'

import { Card, CardContent } from '@/components/ui/card'
import { useFoodEntriesByCategory } from '@/hooks/queries/food.query'
import { MEAL_EMOJI } from '@/lib/constants'

type ListProps = {
  input: ListFoodByCategoryInput
}

export function List(props: ListProps) {
  const { input } = props

  const { data: entries } = useFoodEntriesByCategory(input)
  const t = useTranslations()

  if (entries.length === 0) {
    return <p className='py-8 text-center text-sm text-muted-foreground'>{t('meals.no-items')}</p>
  }

  return (
    <div className='space-y-4'>
      {entries.map((entry) => (
        <Link key={entry.id} href={`/meals/${input.category}/${entry.id}`} className='block'>
          <Card size='sm'>
            <CardContent className='flex items-center gap-3'>
              {entry.imageUrl ? (
                <Image
                  src={entry.imageUrl}
                  alt={entry.foodName}
                  width={56}
                  height={56}
                  className='size-14 rounded-lg object-cover'
                />
              ) : (
                <div className='flex size-14 items-center justify-center rounded-lg bg-muted text-xl'>
                  {MEAL_EMOJI[input.category]}
                </div>
              )}
              <div className='flex-1'>
                <p className='text-sm font-semibold'>{entry.foodName}</p>
                <p className='text-xs text-muted-foreground'>
                  {entry.servingSize} &middot; {Math.round(entry.calories)} kcal
                </p>
              </div>
              <CaretRightIcon size={16} className='text-muted-foreground' />
            </CardContent>
          </Card>
        </Link>
      ))}
    </div>
  )
}
