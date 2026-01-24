import { atom, useAtom } from 'jotai'

const onboardingFormAtom = atom({
  currentWeight: 70,
  goalWeight: 60,
  height: 170,
  currentStep: 1
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
    setStep
  }
}
