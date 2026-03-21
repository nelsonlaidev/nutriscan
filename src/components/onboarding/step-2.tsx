'use client'

import type { CaloriePlan, Gender } from '@/lib/calculations'

import { CalendarBlankIcon, FireIcon, RulerIcon } from '@phosphor-icons/react/ssr'
import { useForm } from '@tanstack/react-form'
import { useTranslations } from 'next-intl'

import { useOnboardingForm } from '@/hooks/use-onboarding-form'
import { calculateAge, generatePlanOptions } from '@/lib/calculations'
import { createOnboardingStep2FormSchema } from '@/lib/zod-schemas'

import {
  Field,
  FieldContent,
  FieldDescription,
  FieldError,
  FieldGroup,
  FieldLabel,
  FieldLegend,
  FieldSet,
  FieldTitle,
} from '../ui/field'
import { InputGroup, InputGroupAddon, InputGroupInput } from '../ui/input-group'
import { RadioGroup, RadioGroupItem } from '../ui/radio-group'
import { OnboardingLayout } from './onboarding-layout'

const FORM_ID = 'onboarding-step-2'

function computePlanOptions(
  birthday: string,
  height: number | '',
  gender: Gender,
  currentWeight: number | '',
  goalWeight: number | '',
) {
  if (!birthday || typeof height !== 'number' || typeof currentWeight !== 'number') return null
  const age = calculateAge(birthday)
  if (age < 1 || age > 120) return null
  return generatePlanOptions(currentWeight, height, age, gender, goalWeight as number)
}

export function Step2() {
  const { data, setStep, updateForm } = useOnboardingForm()
  const t = useTranslations()
  const OnboardingStep2FormSchema = createOnboardingStep2FormSchema(t)

  const GENDER_OPTIONS: Array<{ value: Gender; label: string }> = [
    { value: 'male', label: t('onboarding.male') },
    { value: 'female', label: t('onboarding.female') },
    { value: 'other', label: t('onboarding.other') },
  ]

  const PLAN_LABELS: Record<CaloriePlan, string> = {
    relaxed: t('onboarding.plan-relaxed'),
    steady: t('onboarding.plan-steady'),
    accelerated: t('onboarding.plan-accelerated'),
  }

  const form = useForm({
    defaultValues: {
      birthday: data.birthday,
      height: data.height,
      gender: data.gender,
      plan: data.plan,
    },
    validators: {
      onSubmit: OnboardingStep2FormSchema,
    },
    onSubmit: ({ value }) => {
      updateForm(value)
      setStep(3)
    },
  })

  return (
    <OnboardingLayout
      formId={FORM_ID}
      stepName={t('onboarding.step-2-title')}
      stepDescription={t('onboarding.step-2-description')}
      stepIcon={<FireIcon size={36} className='text-primary-foreground' />}
    >
      <form
        id={FORM_ID}
        onSubmit={(e) => {
          e.preventDefault()
          void form.handleSubmit()
        }}
        className='flex flex-col gap-6'
      >
        <FieldGroup>
          <form.Field name='birthday'>
            {(field) => {
              const isInvalid = field.state.meta.isTouched && !field.state.meta.isValid
              return (
                <Field data-invalid={isInvalid}>
                  <FieldLabel htmlFor={field.name}>{t('onboarding.birthday')}</FieldLabel>
                  <InputGroup>
                    <InputGroupInput
                      id={field.name}
                      name={field.name}
                      type='date'
                      value={field.state.value}
                      onBlur={field.handleBlur}
                      onChange={(e) => {
                        field.handleChange(e.target.value)
                      }}
                      aria-invalid={isInvalid}
                    />
                    <InputGroupAddon align='inline-start'>
                      <CalendarBlankIcon className='text-muted-foreground' />
                    </InputGroupAddon>
                  </InputGroup>
                  {isInvalid && <FieldError errors={field.state.meta.errors} />}
                </Field>
              )
            }}
          </form.Field>

          <form.Field name='height'>
            {(field) => {
              const isInvalid = field.state.meta.isTouched && !field.state.meta.isValid
              return (
                <Field data-invalid={isInvalid}>
                  <FieldLabel htmlFor={field.name}>{t('onboarding.height')}</FieldLabel>
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
                      placeholder={t('onboarding.height-placeholder')}
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

          <form.Field name='gender'>
            {(field) => {
              const isInvalid = field.state.meta.isTouched && !field.state.meta.isValid
              return (
                <FieldSet>
                  <FieldLegend variant='label'>{t('onboarding.gender')}</FieldLegend>
                  <RadioGroup
                    name={field.name}
                    value={field.state.value}
                    onValueChange={field.handleChange}
                    className='grid-cols-3'
                  >
                    {GENDER_OPTIONS.map((option) => (
                      <FieldLabel key={option.value} htmlFor={`${field.name}-${option.value}`}>
                        <Field orientation='horizontal' data-invalid={isInvalid}>
                          <FieldContent>
                            <FieldTitle>{option.label}</FieldTitle>
                          </FieldContent>
                          <RadioGroupItem
                            value={option.value}
                            id={`${field.name}-${option.value}`}
                            aria-invalid={isInvalid}
                          />
                        </Field>
                      </FieldLabel>
                    ))}
                  </RadioGroup>
                  {isInvalid && <FieldError errors={field.state.meta.errors} />}
                </FieldSet>
              )
            }}
          </form.Field>
        </FieldGroup>

        <form.Field name='plan'>
          {(field) => {
            const isInvalid = field.state.meta.isTouched && !field.state.meta.isValid
            return (
              <form.Subscribe selector={(state) => state.values}>
                {(values) => {
                  const options = computePlanOptions(
                    values.birthday,
                    values.height,
                    values.gender,
                    data.currentWeight,
                    data.goalWeight,
                  )

                  if (!options) return null

                  return (
                    <FieldSet>
                      <FieldLegend variant='label'>{t('onboarding.choose-plan')}</FieldLegend>
                      <RadioGroup name={field.name} value={field.state.value} onValueChange={field.handleChange}>
                        {options.map((option) => (
                          <FieldLabel key={option.plan} htmlFor={`${field.name}-${option.plan}`}>
                            <Field orientation='horizontal' data-invalid={isInvalid}>
                              <FieldContent>
                                <FieldTitle>{PLAN_LABELS[option.plan]}</FieldTitle>
                                <FieldDescription>
                                  {t('onboarding.plan-details', {
                                    weeklyLoss: option.weeklyLoss,
                                    weeks: option.weeksToGoal,
                                  })}
                                </FieldDescription>
                              </FieldContent>
                              <div className='flex h-full flex-col items-end justify-between'>
                                <RadioGroupItem
                                  value={option.plan}
                                  id={`${field.name}-${option.plan}`}
                                  aria-invalid={isInvalid}
                                />
                                <span className='text-sm font-semibold text-primary'>
                                  {t('onboarding.calories-per-day', { calories: option.calories })}
                                </span>
                              </div>
                            </Field>
                          </FieldLabel>
                        ))}
                      </RadioGroup>
                      {isInvalid && <FieldError errors={field.state.meta.errors} />}
                    </FieldSet>
                  )
                }}
              </form.Subscribe>
            )
          }}
        </form.Field>
      </form>
    </OnboardingLayout>
  )
}
