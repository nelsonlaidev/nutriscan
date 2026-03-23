'use client'

import { BarbellIcon, TargetIcon } from '@phosphor-icons/react/ssr'
import { useForm } from '@tanstack/react-form'
import { useTranslations } from 'next-intl'

import { useOnboardingForm } from '@/hooks/use-onboarding-form'
import { createOnboardingStep1FormSchema } from '@/lib/zod-schemas'

import { Field, FieldError, FieldGroup, FieldLabel } from '../ui/field'
import { InputGroup, InputGroupAddon, InputGroupInput } from '../ui/input-group'
import { OnboardingLayout } from './onboarding-layout'

const FORM_ID = 'onboarding-step-1'

export function Step1() {
  const { data, setStep, updateForm } = useOnboardingForm()
  const t = useTranslations()
  const OnboardingStep1FormSchema = createOnboardingStep1FormSchema(t)

  const form = useForm({
    defaultValues: {
      currentWeight: data.currentWeight,
      goalWeight: data.goalWeight,
    },
    validators: {
      onSubmit: OnboardingStep1FormSchema,
    },
    onSubmit: ({ value }) => {
      updateForm(value)
      setStep(2)
    },
  })

  return (
    <OnboardingLayout
      formId={FORM_ID}
      stepName={t('onboarding.step-1-title')}
      stepDescription={t('onboarding.step-1-description')}
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
          <form.Field name='currentWeight'>
            {(field) => {
              const isInvalid = field.state.meta.isTouched && !field.state.meta.isValid
              return (
                <Field data-invalid={isInvalid}>
                  <FieldLabel htmlFor={field.name}>{t('onboarding.current-weight')}</FieldLabel>
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
                      placeholder={t('onboarding.current-weight-placeholder')}
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

          <form.Field name='goalWeight'>
            {(field) => {
              const isInvalid = field.state.meta.isTouched && !field.state.meta.isValid
              return (
                <Field data-invalid={isInvalid}>
                  <FieldLabel htmlFor={field.name}>{t('onboarding.goal-weight')}</FieldLabel>
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
                      placeholder={t('onboarding.goal-weight-placeholder')}
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

        <form.Subscribe selector={(state) => state.values}>
          {(values) => {
            const cw = values.currentWeight
            const gw = values.goalWeight
            const diff = typeof cw === 'number' && typeof gw === 'number' ? cw - gw : null
            if (diff === null || diff <= 0) return null
            return (
              <p className='mt-4 text-center text-sm text-muted-foreground'>
                {t('onboarding.weight-loss-plan', { diff: diff.toFixed(1), current: cw })}
              </p>
            )
          }}
        </form.Subscribe>
      </form>
    </OnboardingLayout>
  )
}
