'use client'

import { BarbellIcon } from '@phosphor-icons/react'
import { useForm } from '@tanstack/react-form'

import { useOnboardingForm } from '@/hooks/use-onboarding-form'
import { OnboardingStep1FormSchema } from '@/lib/zod-schemas'

import { Field, FieldError, FieldGroup, FieldLabel } from '../ui/field'
import { InputGroup, InputGroupAddon, InputGroupInput } from '../ui/input-group'

import { OnboardingLayout } from './onboarding-layout'

const FORM_ID = 'onboarding-step-1'

export function Step1() {
  const { data, setStep, updateForm } = useOnboardingForm()

  const form = useForm({
    defaultValues: {
      currentWeight: data.currentWeight
    },
    validators: {
      onSubmit: OnboardingStep1FormSchema
    },
    onSubmit: ({ value }) => {
      updateForm(value)
      setStep(2)
    }
  })

  return (
    <OnboardingLayout
      formId={FORM_ID}
      stepName="What's current weight?"
      stepDescription='This helps us calculate your daily nutritional needs and track your progress.'
      stepIcon={<BarbellIcon size={36} className='text-primary-foreground' />}
    >
      <form
        id={FORM_ID}
        onSubmit={(e) => {
          e.preventDefault()
          void form.handleSubmit()
        }}
      >
        <FieldGroup>
          <form.Field name='currentWeight'>
            {(field) => {
              const isInvalid = field.state.meta.isTouched && !field.state.meta.isValid
              return (
                <Field data-invalid={isInvalid}>
                  <FieldLabel htmlFor={field.name}>Current Weight</FieldLabel>
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
                      placeholder='Enter weight'
                    />
                    <InputGroupAddon align='inline-start'>
                      <BarbellIcon className='text-muted-foreground' />
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
