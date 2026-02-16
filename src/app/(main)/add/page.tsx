'use client'

import { format } from 'date-fns'
import { useRouter } from 'next/navigation'
import { useTranslations } from 'next-intl'
import { useCallback, useState, useTransition } from 'react'
import { toast } from 'sonner'

import { addFoodEntry } from '@/actions/add-food-entry'
import { AiImageMode } from '@/components/add/ai-image-mode'
import { BarcodeMode } from '@/components/add/barcode-mode'
import { ManualEntryMode } from '@/components/add/manual-entry-mode'
import { MealCategoryPicker } from '@/components/add/meal-category-picker'
import { type Mode, ModeSelector } from '@/components/add/mode-selector'
import { type NutritionData, NutritionResult } from '@/components/add/nutrition-result'
import { PageContainer } from '@/components/page-container'
import { PageTitle } from '@/components/page-title'
import { Button } from '@/components/ui/button'
import { Spinner } from '@/components/ui/spinner'
import { DEFAULT_MEAL, type Meal } from '@/lib/constants'

type Step = 'input' | 'review' | 'meal-pick'

function Page() {
  const t = useTranslations()
  const router = useRouter()
  const [mode, setMode] = useState<Mode>('ai-scan')
  const [step, setStep] = useState<Step>('input')
  const [nutritionData, setNutritionData] = useState<NutritionData | null>(null)
  const [selectedMeal, setSelectedMeal] = useState<Meal>(DEFAULT_MEAL)
  const [isPending, startTransition] = useTransition()

  const handleScanResult = useCallback((data: NutritionData) => {
    setNutritionData(data)
    setStep('review')
  }, [])

  const handleManualSubmit = useCallback((data: NutritionData) => {
    setNutritionData(data)
    setStep('meal-pick')
  }, [])

  function handleConfirmNutrition() {
    setStep('meal-pick')
  }

  function handleAddToMeal() {
    if (!nutritionData) {
      toast.error(t('add-food.select-meal-error'))
      return
    }

    startTransition(async () => {
      const result = await addFoodEntry({
        foodName: nutritionData.foodName,
        servingSize: nutritionData.servingSize,
        calories: nutritionData.calories,
        protein: nutritionData.protein,
        carbs: nutritionData.carbs,
        fat: nutritionData.fat,
        mealCategory: selectedMeal,
        source: mode,
        imageUrl: nutritionData.imageUrl,
        date: format(new Date(), 'yyyy-MM-dd')
      })

      if (result.serverError) {
        toast.error(t('add-food.save-error'))
        return
      }

      toast.success(t('add-food.success', { mealName: t(`meals.${selectedMeal}`) }))
      router.push('/dashboard')
    })
  }

  function handleBack() {
    if (step === 'meal-pick') {
      setStep(mode === 'manual' ? 'input' : 'review')
      setSelectedMeal(DEFAULT_MEAL)
    }

    if (step === 'review') {
      setStep('input')
      setNutritionData(null)
    }
  }

  return (
    <PageContainer>
      <PageTitle title={t('add-food.page-title')} withBackButton={step !== 'input'} onClickBack={handleBack} />

      <div className='flex flex-col gap-5'>
        {step === 'input' && (
          <>
            <ModeSelector value={mode} onChange={setMode} />

            {mode === 'ai-scan' && <AiImageMode onResult={handleScanResult} />}
            {mode === 'manual' && <ManualEntryMode onSubmit={handleManualSubmit} />}
            {mode === 'barcode' && <BarcodeMode onResult={handleScanResult} />}
          </>
        )}

        {step === 'review' && nutritionData && (
          <>
            <NutritionResult data={nutritionData} onChange={setNutritionData} />
            <Button onClick={handleConfirmNutrition}>{t('add-food.confirm')}</Button>
          </>
        )}

        {step === 'meal-pick' && (
          <>
            {nutritionData && (
              <div className='rounded-2xl border border-border bg-card p-4'>
                <p className='font-medium'>{nutritionData.foodName}</p>
                <p className='text-sm text-muted-foreground'>
                  {nutritionData.servingSize} &middot; {nutritionData.calories} kcal
                </p>
              </div>
            )}
            <MealCategoryPicker value={selectedMeal} onChange={setSelectedMeal} />
            <Button onClick={handleAddToMeal} disabled={isPending}>
              {isPending && <Spinner data-icon='inline-start' />}
              {t('add-food.add-to-meal')}
            </Button>
          </>
        )}
      </div>
    </PageContainer>
  )
}

export default Page
