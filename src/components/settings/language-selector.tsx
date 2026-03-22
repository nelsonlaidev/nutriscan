'use client'

import { GlobeIcon } from '@phosphor-icons/react/ssr'
import { useRouter } from 'next/navigation'
import { useLocale, useTranslations } from 'next-intl'

import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { LOCALE_ITEMS } from '@/lib/constants'
import { client } from '@/orpc/client'

export function LanguageSelector() {
  const locale = useLocale()
  const t = useTranslations()
  const router = useRouter()

  return (
    <div className='flex h-9 items-center justify-between'>
      <div className='flex items-center gap-2'>
        <GlobeIcon size={20} />
        <Label htmlFor='language-select' className='text-base font-normal'>
          {t('settings.language')}
        </Label>
      </div>
      <Select
        items={LOCALE_ITEMS}
        value={locale}
        onValueChange={(value) => {
          if (value !== null) {
            void client.settings.updateLocale({ locale: value })
            router.refresh()
          }
        }}
      >
        <SelectTrigger className='w-35' id='language-select'>
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          {LOCALE_ITEMS.map((item) => (
            <SelectItem key={item.value} value={item.value}>
              {item.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  )
}
