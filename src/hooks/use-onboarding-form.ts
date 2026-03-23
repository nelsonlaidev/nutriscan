import type { CaloriePlan, Gender } from '@/lib/calculations'

import { atom, useAtom } from 'jotai'

import { DEFAULT_CURRENT_WEIGHT, DEFAULT_GOAL_WEIGHT, DEFAULT_HEIGHT } from '@/lib/constants'

type OnboardingForm = {
  currentWeight: number | ''
  goalWeight: number | ''
  height: number | ''
  birthday: string
  gender: Gender
  plan: CaloriePlan
  currentStep: number
}

const onboardingFormAtom = atom<OnboardingForm>({
  currentWeight: DEFAULT_CURRENT_WEIGHT,
  goalWeight: DEFAULT_GOAL_WEIGHT,
  height: DEFAULT_HEIGHT,
  birthday: '',
  gender: 'male',
  plan: 'steady',
  currentStep: 1,
})

export function useOnboardingForm() {
  const [data, setData] = useAtom(onboardingFormAtom)

  function updateForm(updates: Partial<typeof data>) {
    setData((prev) => ({ ...prev, ...updates }))
  }

  function setStep(step: number) {
    setData((prev) => ({ ...prev, currentStep: step }))
  }

  return {
    data,
    updateForm,
    setStep,
  }
}
