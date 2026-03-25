'use client'

import type { Translator } from '@/types'
import type { AchievementUnlockSummary } from './types'

import { toast } from 'sonner'

import { getAchievementTitle } from './catalog'

export function showAchievementUnlockToast(newUnlocks: AchievementUnlockSummary[], t: Translator) {
  if (newUnlocks.length === 0) return

  const [firstUnlock] = newUnlocks

  if (!firstUnlock) return

  if (newUnlocks.length === 1) {
    toast.success(t('achievements.toast.single', { title: getAchievementTitle(firstUnlock.id, t) }))
    return
  }

  toast.success(
    t('achievements.toast.multiple', {
      title: getAchievementTitle(firstUnlock.id, t),
      count: newUnlocks.length - 1,
    }),
  )
}
