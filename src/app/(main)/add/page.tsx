'use client'

import { ArrowLeftIcon } from '@phosphor-icons/react'
import { useRouter } from 'next/navigation'
import { useCallback, useState } from 'react'
import { toast } from 'sonner'

import AiImageMode from '@/components/add/ai-image-mode'
import BarcodeMode from '@/components/add/barcode-mode'
import ManualEntryMode from '@/components/add/manual-entry-mode'
import MealCategoryPicker from '@/components/add/meal-category-picker'
import ModeSelector, { type Mode } from '@/components/add/mode-selector'
import NutritionResult, { type NutritionData } from '@/components/add/nutrition-result'
import { Button } from '@/components/ui/button'
import { MEAL_CATEGORIES } from '@/lib/mock-data'

type Step = 'input' | 'review' | 'meal-pick'

function Page() {
  const router = useRouter()
  const [mode, setMode] = useState<Mode>('ai-scan')
  const [step, setStep] = useState<Step>('input')
  const [nutritionData, setNutritionData] = useState<NutritionData | null>(null)
  const [selectedMeal, setSelectedMeal] = useState<string | null>(null)

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
    if (!selectedMeal) {
      toast.error('Please select a meal category')
      return
    }

    const mealName = MEAL_CATEGORIES.find((c) => c.id === selectedMeal)?.name
    toast.success(`Food added to ${mealName}!`)
    router.push('/dashboard')
  }

  function handleBack() {
    if (step === 'meal-pick') {
      setStep(mode === 'manual' ? 'input' : 'review')
      setSelectedMeal(null)
    } else if (step === 'review') {
      setStep('input')
      setNutritionData(null)
    } else {
      router.back()
    }
  }

  return (
    <div className='-m-6 flex flex-col'>
      {/* Header */}
      <div className='flex items-center gap-3 px-6 pt-6 pb-4'>
        <button type='button' onClick={handleBack} className='text-foreground'>
          <ArrowLeftIcon size={24} />
        </button>
        <h1 className='text-xl font-semibold'>Add Food</h1>
      </div>

      <div className='flex flex-col gap-5 px-6 pb-24'>
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
            <Button onClick={handleConfirmNutrition}>Confirm</Button>
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
            <Button onClick={handleAddToMeal}>Add to Meal</Button>
          </>
        )}
      </div>
    </div>
  )
}

export default Page
