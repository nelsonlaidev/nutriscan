'use client'

import { useForm } from '@tanstack/react-form'
import { RulerIcon } from 'lucide-react'

import { useOnboardingForm } from '@/hooks/use-onboarding-form'
import { OnboardingStep4Schema } from '@/lib/form-schemas'

import { Field, FieldError, FieldGroup, FieldLabel } from '../ui/field'
import { InputGroup, InputGroupAddon, InputGroupInput } from '../ui/input-group'

import OnboardingLayout from './onboarding-layout'

const FORM_ID = 'onboarding-step-4'

function Step4() {
  const { data, setStep, updateForm } = useOnboardingForm()

  const form = useForm({
    defaultValues: {
      height: data.height
    },
    validators: {
      onSubmit: OnboardingStep4Schema
    },
    onSubmit: ({ value }) => {
      updateForm(value)
      setStep(5)
    }
  })

  return (
    <OnboardingLayout
      formId={FORM_ID}
      stepName="What's your height?"
      stepDescription='Your height helps us provide accurate BMI calculations and personalized recommendations.'
      stepIcon={<RulerIcon className='size-9 text-background' />}
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
                      onBlur={field.handleBlur}
                      onChange={(e) => {
                        field.handleChange(e.target.valueAsNumber)
                      }}
                      aria-invalid={isInvalid}
                      placeholder='Enter height'
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

export default Step4
