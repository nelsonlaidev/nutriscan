'use client'

import { RulerIcon } from '@phosphor-icons/react'
import { useForm } from '@tanstack/react-form'
import { useRouter } from 'next/navigation'
import { useAction } from 'next-safe-action/hooks'

import { completeOnboarding } from '@/actions/onboarding'
import { useOnboardingForm } from '@/hooks/use-onboarding-form'
import { onActionError } from '@/lib/safe-action-utils'
import { OnboardingStep3FormSchema } from '@/lib/zod-schemas'

import { Field, FieldError, FieldGroup, FieldLabel } from '../ui/field'
import { InputGroup, InputGroupAddon, InputGroupInput } from '../ui/input-group'

import OnboardingLayout from './onboarding-layout'

const FORM_ID = 'onboarding-step-3'

function Step3() {
  const router = useRouter()
  const { data } = useOnboardingForm()

  const { execute, isPending } = useAction(completeOnboarding, {
    onSuccess: () => {
      router.push('/')
    },
    onError: onActionError
  })

  const form = useForm({
    defaultValues: {
      height: data.height
    },
    validators: {
      onSubmit: OnboardingStep3FormSchema
    },
    onSubmit: ({ value }) => {
      execute({
        currentWeight: data.currentWeight as number,
        goalWeight: data.goalWeight as number,
        height: value.height as number
      })
    }
  })

  return (
    <OnboardingLayout
      formId={FORM_ID}
      stepName="What's your height?"
      stepDescription='Your height helps us provide accurate BMI calculations and personalized recommendations.'
      stepIcon={<RulerIcon className='size-9 text-primary-foreground' />}
      continueDisabled={isPending}
    >
      <form
        id={FORM_ID}
        onSubmit={(e) => {
          e.preventDefault()
          form.handleSubmit()
        }}
      >
        <FieldGroup>
          <form.Field name='height'>
            {(field) => {
              const isInvalid = field.state.meta.isTouched && !field.state.meta.isValid
              return (
                <Field data-invalid={isInvalid}>
                  <FieldLabel htmlFor={field.name}>Height</FieldLabel>
                  <InputGroup>
                    <InputGroupInput
                      id={field.name}
                      name={field.name}
                      value={field.state.value}
                      type='number'
                      min={50}
                      max={250}
                      step={0.1}
                      inputMode='decimal'
                      onBlur={field.handleBlur}
                      onChange={(e) => {
                        const value = e.target.valueAsNumber
                        field.handleChange(Number.isNaN(value) ? '' : value)
                      }}
                      aria-invalid={isInvalid}
                      placeholder='Enter height'
                      disabled={isPending}
                    />
                    <InputGroupAddon align='inline-start'>
                      <RulerIcon className='text-muted-foreground' />
                    </InputGroupAddon>
                    <InputGroupAddon align='inline-end'>cm</InputGroupAddon>
                  </InputGroup>
                  {isInvalid && <FieldError errors={field.state.meta.errors} />}
                </Field>
              )
            }}
          </form.Field>
        </FieldGroup>
      </form>
    </OnboardingLayout>
  )
}

export default Step3
