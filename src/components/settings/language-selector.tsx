'use client'

import { GlobeIcon } from '@phosphor-icons/react'
import { useState } from 'react'

import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'

export function LanguageSelector() {
  const [language, setLanguage] = useState('en')

  return (
    <div className='flex items-center justify-between'>
      <div className='flex items-center gap-2'>
        <GlobeIcon size={20} />
        <Label htmlFor='language-select' className='text-base font-normal'>
          Language
        </Label>
      </div>
      <Select
        value={language}
        onValueChange={(e) => {
          if (e !== null) setLanguage(e)
        }}
      >
        <SelectTrigger className='w-35' id='language-select'>
          <SelectValue placeholder='Select language' />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value='en'>English</SelectItem>
          <SelectItem value='es'>Español</SelectItem>
          <SelectItem value='fr'>Français</SelectItem>
          <SelectItem value='de'>Deutsch</SelectItem>
        </SelectContent>
      </Select>
    </div>
  )
}
