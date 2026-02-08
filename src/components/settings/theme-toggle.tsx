'use client'

import { MoonIcon, SunIcon } from '@phosphor-icons/react'
import { useTheme } from 'next-themes'
import { useEffect, useState } from 'react'

import { Label } from '@/components/ui/label'
import { Switch } from '@/components/ui/switch'

export function ThemeToggle() {
  const { theme, setTheme } = useTheme()
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) return null

  return (
    <div className='flex items-center justify-between'>
      <div className='flex items-center gap-2'>
        {theme === 'dark' ? <MoonIcon size={20} /> : <SunIcon size={20} />}
        <Label htmlFor='theme-mode' className='text-base font-normal'>
          Dark Mode
        </Label>
      </div>
      <Switch
        id='theme-mode'
        checked={theme === 'dark'}
        onCheckedChange={(checked) => {
          setTheme(checked ? 'dark' : 'light')
        }}
      />
    </div>
  )
}
