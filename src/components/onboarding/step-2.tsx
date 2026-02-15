'use client'

import { TargetIcon } from '@phosphor-icons/react'
import { useForm } from '@tanstack/react-form'

import { useOnboardingForm } from '@/hooks/use-onboarding-form'
import { OnboardingStep2FormSchema } from '@/lib/zod-schemas'

import { Field, FieldError, FieldGroup, FieldLabel } from '../ui/field'
import { InputGroup, InputGroupAddon, InputGroupInput } from '../ui/input-group'

import { OnboardingLayout } from './onboarding-layout'

const FORM_ID = 'onboarding-step-2'

export function Step2() {
  const { data, setStep, updateForm } = useOnboardingForm()

  const form = useForm({
    defaultValues: {
      goalWeight: data.goalWeight
    },
    validators: {
      onSubmit: OnboardingStep2FormSchema
    },
    onSubmit: ({ value }) => {
      updateForm(value)
      setStep(3)
    }
  })

  return (
    <OnboardingLayout
      formId={FORM_ID}
      stepName="What's your goal weight?"
      stepDescription='Setting a goal helps us track your progress and provide personalized meal recommendations.'
      stepIcon={<TargetIcon size={36} className='text-primary-foreground' />}
    >
      <form
        id={FORM_ID}
        onSubmit={(e) => {
          e.preventDefault()
          void form.handleSubmit()
        }}
      >
        <FieldGroup>
          <form.Field name='goalWeight'>
            {(field) => {
              const isInvalid = field.state.meta.isTouched && !field.state.meta.isValid
              return (
                <Field data-invalid={isInvalid}>
                  <FieldLabel htmlFor={field.name}>Goal Weight</FieldLabel>
                  <InputGroup>
                    <InputGroupInput
                      id={field.name}
                      name={field.name}
                      value={field.state.value}
                      type='number'
                      min={20}
                      max={300}
                      step={0.1}
                      inputMode='decimal'
                      onBlur={field.handleBlur}
                      onChange={(e) => {
                        const value = e.target.valueAsNumber
                        field.handleChange(Number.isNaN(value) ? '' : value)
                      }}
                      aria-invalid={isInvalid}
                      placeholder='Enter goal weight'
                    />
                    <InputGroupAddon align='inline-start'>
                      <TargetIcon className='text-muted-foreground' />
                    </InputGroupAddon>
                    <InputGroupAddon align='inline-end'>kg</InputGroupAddon>
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
