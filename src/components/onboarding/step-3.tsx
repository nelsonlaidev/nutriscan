'use client'

import { CheckCircleIcon } from '@phosphor-icons/react/ssr'
import { useRouter } from 'next/navigation'
import { useTranslations } from 'next-intl'
import { useAction } from 'next-safe-action/hooks'
import { useMemo } from 'react'

import { completeOnboarding } from '@/actions/onboarding'
import { useOnboardingForm } from '@/hooks/use-onboarding-form'
import {
  calculateAge,
  calculateBMR,
  calculateCalorieBudget,
  calculateMacros,
  calculateTDEE,
  getWeeklyLoss,
} from '@/lib/calculations'
import { onActionError } from '@/lib/safe-action-utils'

import { Card, CardContent, CardHeader, CardTitle } from '../ui/card'
import { OnboardingLayout } from './onboarding-layout'

export function Step3() {
  const router = useRouter()
  const { data } = useOnboardingForm()
  const t = useTranslations()

  const computed = useMemo(() => {
    const currentWeight = data.currentWeight as number
    const goalWeight = data.goalWeight as number
    const height = data.height as number
    const age = calculateAge(data.birthday)
    const bmr = calculateBMR(currentWeight, height, age, data.gender)
    const tdee = calculateTDEE(bmr)
    const calories = calculateCalorieBudget(tdee, data.plan)
    const macros = calculateMacros(calories)
    const weeklyLoss = getWeeklyLoss(data.plan)
    const weightToLose = currentWeight - goalWeight

    return { currentWeight, goalWeight, calories, macros, weeklyLoss, weightToLose }
  }, [data])

  const { execute, isPending } = useAction(completeOnboarding, {
    onSuccess: () => {
      router.push('/')
    },
    onError: onActionError,
  })

  function handleConfirm() {
    execute({
      currentWeight: computed.currentWeight,
      goalWeight: computed.goalWeight,
      height: data.height as number,
      birthday: data.birthday,
      gender: data.gender,
      plan: data.plan,
      calorieBudget: computed.calories,
      proteinTarget: computed.macros.protein,
      carbTarget: computed.macros.carbs,
      fatTarget: computed.macros.fat,
    })
  }

  return (
    <OnboardingLayout
      stepName={t('onboarding.step-3-title')}
      stepDescription={t('onboarding.step-3-description')}
      stepIcon={<CheckCircleIcon size={36} className='text-primary-foreground' />}
      continueLabel={t('onboarding.confirm')}
      continueDisabled={isPending}
      onSubmit={handleConfirm}
    >
      <div className='flex flex-col gap-4'>
        <Card size='sm'>
          <CardHeader>
            <CardTitle>{t('onboarding.summary-goal')}</CardTitle>
          </CardHeader>
          <CardContent className='space-y-2'>
            <p className='text-sm text-muted-foreground'>
              {t('onboarding.summary-goal-value', {
                weight: computed.weightToLose.toFixed(1),
                target: computed.goalWeight,
              })}
            </p>
          </CardContent>
        </Card>

        <Card size='sm'>
          <CardHeader>
            <CardTitle>{t('onboarding.daily-budget')}</CardTitle>
          </CardHeader>
          <CardContent className='space-y-2'>
            <p className='text-2xl font-bold text-primary'>
              {t('onboarding.daily-budget-value', { calories: computed.calories })}
            </p>
            <p className='text-sm text-muted-foreground'>
              {t('onboarding.weekly-rate', { loss: computed.weeklyLoss })}
            </p>
          </CardContent>
        </Card>

        <Card size='sm'>
          <CardHeader>
            <CardTitle>{t('onboarding.nutrient-targets')}</CardTitle>
          </CardHeader>
          <CardContent className='space-y-2'>
            <div className='grid grid-cols-3 gap-3'>
              <div className='text-center'>
                <p className='text-lg font-semibold'>{computed.macros.protein}g</p>
                <p className='text-xs text-muted-foreground'>{t('dashboard.protein')}</p>
              </div>
              <div className='text-center'>
                <p className='text-lg font-semibold'>{computed.macros.carbs}g</p>
                <p className='text-xs text-muted-foreground'>{t('dashboard.carbs')}</p>
              </div>
              <div className='text-center'>
                <p className='text-lg font-semibold'>{computed.macros.fat}g</p>
                <p className='text-xs text-muted-foreground'>{t('dashboard.fat')}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </OnboardingLayout>
  )
}
