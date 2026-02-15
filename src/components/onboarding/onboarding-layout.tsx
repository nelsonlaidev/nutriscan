import { ArrowLeftIcon, ArrowRightIcon } from '@phosphor-icons/react'

import { useOnboardingForm } from '@/hooks/use-onboarding-form'

import { Button } from '../ui/button'

type OnboardingLayoutProps = {
  children: React.ReactNode
  formId: string
  stepName: string
  stepDescription: string
  stepIcon: React.ReactNode
  continueDisabled?: boolean
}

export function OnboardingLayout(props: OnboardingLayoutProps) {
  const { children, formId, stepName, stepDescription, stepIcon, continueDisabled = false } = props
  const { data, setStep } = useOnboardingForm()

  function handleBack() {
    setStep(data.currentStep - 1)
  }

  return (
    <div className='flex min-h-svh flex-col gap-8 p-6'>
      {data.currentStep > 1 && (
        <div>
          <Button variant='secondary' className='inline-flex' onClick={handleBack}>
            <ArrowLeftIcon />
            Back
          </Button>
        </div>
      )}
      <div className='flex flex-col items-center gap-4'>
        <div className='flex size-18 items-center justify-center rounded-2xl bg-primary'>{stepIcon}</div>
        <div className='space-y-2 text-center'>
          <h1 className='text-2xl font-semibold'>{stepName}</h1>
          <p className='text-muted-foreground'>{stepDescription}</p>
        </div>
      </div>

      {children}

      {/* Spacer */}
      <div className='flex-1' />

      <Button disabled={continueDisabled} form={formId} type='submit'>
        Continue <ArrowRightIcon />
      </Button>
    </div>
  )
}
