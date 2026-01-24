'use client'

import { useForm } from '@tanstack/react-form'
import { UserIcon } from 'lucide-react'

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
      name: data.name
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
      stepName="What's your name?"
      stepDescription='Let us know what to call you. This will be your display name in NutriScan.'
      stepIcon={<UserIcon className='size-9 text-background' />}
    >
      <form
        id={FORM_ID}
        onSubmit={(e) => {
          e.preventDefault()
          form.handleSubmit()
        }}
      >
        <FieldGroup>
          <form.Field name='name'>
            {(field) => {
              const isInvalid = field.state.meta.isTouched && !field.state.meta.isValid
              return (
                <Field data-invalid={isInvalid}>
                  <FieldLabel htmlFor={field.name}>Display Name</FieldLabel>
                  <InputGroup>
                    <InputGroupInput
                      id={field.name}
                      name={field.name}
                      value={field.state.value}
                      type='text'
                      onBlur={field.handleBlur}
                      onChange={(e) => {
                        field.handleChange(e.target.value)
                      }}
                      aria-invalid={isInvalid}
                      placeholder='Name'
                    />
                    <InputGroupAddon align='inline-start'>
                      <UserIcon className='text-muted-foreground' />
                    </InputGroupAddon>
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
