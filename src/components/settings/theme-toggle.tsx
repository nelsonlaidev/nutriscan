'use client'

import { MoonIcon, SunIcon } from '@phosphor-icons/react/ssr'
import { useTranslations } from 'next-intl'
import { useTheme } from 'next-themes'

import { Label } from '@/components/ui/label'
import { Switch } from '@/components/ui/switch'
import { useIsHydrated } from '@/hooks/use-is-hydrated'

export function ThemeToggle() {
  const { resolvedTheme, setTheme } = useTheme()
  const isHydrated = useIsHydrated()
  const t = useTranslations()

  if (!isHydrated) return null

  return (
    <div className='flex h-9 items-center justify-between'>
      <div className='flex items-center gap-2'>
        <SunIcon size={20} className='dark:hidden' />
        <MoonIcon size={20} className='hidden dark:block' />
        <Label htmlFor='theme-mode' className='text-base font-normal'>
          {t('settings.dark-mode')}
        </Label>
      </div>
      <Switch
        id='theme-mode'
        aria-label={t('settings.dark-mode')}
        checked={resolvedTheme === 'dark'}
        onCheckedChange={(checked) => {
          setTheme(checked ? 'dark' : 'light')
        }}
      />
    </div>
  )
}
