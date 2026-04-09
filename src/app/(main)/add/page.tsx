'use client'

import { ArrowRightIcon } from '@phosphor-icons/react/ssr'
import Link from 'next/link'
import { useTranslations } from 'next-intl'

import { MainLayout } from '@/components/main-layout'
import { Card, CardContent } from '@/components/ui/card'
import { ADD_FOOD_OPTIONS } from '@/lib/links'
import { cn } from '@/lib/utils'

export default function Page() {
  const t = useTranslations()

  return (
    <MainLayout title={t('add-food.page-title')}>
      <div className='space-y-4'>
        <p className='text-sm text-muted-foreground'>{t('add-food.options-description')}</p>

        {ADD_FOOD_OPTIONS.map((option) => (
          <Link href={option.href} key={option.href} className='block'>
            <Card size='sm'>
              <CardContent className='flex h-24 items-center gap-4'>
                <div
                  className={cn(
                    'flex size-14 shrink-0 items-center justify-center rounded-3xl ring-1',
                    option.iconClassName,
                  )}
                >
                  <option.icon size={28} weight='duotone' />
                </div>

                <div className='min-w-0 flex-1'>
                  <h2 className='text-lg font-semibold tracking-tight'>{t(option.title)}</h2>
                  <p className='mt-1 text-sm text-muted-foreground'>{t(option.description)}</p>
                </div>

                <ArrowRightIcon className='size-6 shrink-0 text-muted-foreground' />
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>
    </MainLayout>
  )
}
