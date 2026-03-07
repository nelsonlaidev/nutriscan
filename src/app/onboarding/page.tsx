'use client'

import { Step1 } from '@/components/onboarding/step-1'
import { Step2 } from '@/components/onboarding/step-2'
import { Step3 } from '@/components/onboarding/step-3'
import { useOnboardingForm } from '@/hooks/use-onboarding-form'

export default function Page() {
  const { data } = useOnboardingForm()

  return (
    <>
      {data.currentStep === 1 && <Step1 />}
      {data.currentStep === 2 && <Step2 />}
      {data.currentStep === 3 && <Step3 />}
    </>
  )
}
