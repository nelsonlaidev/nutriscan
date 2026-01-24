'use client'

import { useForm } from '@tanstack/react-form'
import { WeightIcon } from 'lucide-react'

import { useOnboardingForm } from '@/hooks/use-onboarding-form'
import { OnboardingStep1Schema } from '@/lib/form-schemas'

import { Field, FieldError, FieldGroup, FieldLabel } from '../ui/field'
import { InputGroup, InputGroupAddon, InputGroupInput } from '../ui/input-group'

import OnboardingLayout from './onboarding-layout'

const FORM_ID = 'onboarding-step-1'

function Step1() {
  const { data, setStep, updateForm } = useOnboardingForm()

  const form = useForm({
    defaultValues: {
      currentWeight: data.currentWeight
    },
    validators: {
      onSubmit: OnboardingStep1Schema
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
      stepIcon={<WeightIcon className='size-9 text-background' />}
    >
      <form
        id={FORM_ID}
        onSubmit={(e) => {
          e.preventDefault()
          form.handleSubmit()
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
                      step={1}
                      inputMode='numeric'
                      onBlur={field.handleBlur}
                      onChange={(e) => {
                        const value = e.target.valueAsNumber
                        field.handleChange(Number.isNaN(value) ? '' : value)
                      }}
                      aria-invalid={isInvalid}
                      placeholder='Enter weight'
                    />
                    <InputGroupAddon align='inline-start'>
                      <WeightIcon className='text-muted-foreground' />
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

export default Step1
