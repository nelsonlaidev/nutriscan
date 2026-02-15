'use client'

import { MoonIcon, SunIcon } from '@phosphor-icons/react'
import { useTheme } from 'next-themes'

import { Label } from '@/components/ui/label'
import { Switch } from '@/components/ui/switch'
import { useIsMounted } from '@/hooks/use-is-mounted'

export function ThemeToggle() {
  const { resolvedTheme, setTheme } = useTheme()
  const isMounted = useIsMounted()

  if (!isMounted) return null

  return (
    <div className='flex items-center justify-between'>
      <div className='flex items-center gap-2'>
        <SunIcon size={20} className='dark:hidden' />
        <MoonIcon size={20} className='hidden dark:block' />
        <Label htmlFor='theme-mode' className='text-base font-normal'>
          Dark Mode
        </Label>
      </div>
      <Switch
        id='theme-mode'
        checked={resolvedTheme === 'dark'}
        onCheckedChange={(checked) => {
          setTheme(checked ? 'dark' : 'light')
        }}
      />
    </div>
  )
}
