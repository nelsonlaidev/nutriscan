'use client'

import type { CaloriePlan, Gender } from '@/lib/calculations'

import { FireIcon, RulerIcon } from '@phosphor-icons/react/ssr'
import { useForm } from '@tanstack/react-form'
import { useTranslations } from 'next-intl'

import { useOnboardingForm } from '@/hooks/use-onboarding-form'
import { calculateAge, generatePlanOptions } from '@/lib/calculations'
import { createOnboardingStep2FormSchema } from '@/lib/zod-schemas'

import { Field, FieldError, FieldGroup, FieldLabel } from '../ui/field'
import { Input } from '../ui/input'
import { InputGroup, InputGroupAddon, InputGroupInput } from '../ui/input-group'

import { OnboardingLayout } from './onboarding-layout'

const FORM_ID = 'onboarding-step-2'

function computePlanOptions(
  birthday: string,
  height: number | '',
  gender: Gender,
  currentWeight: number | '',
  goalWeight: number | ''
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
    { value: 'other', label: t('onboarding.other') }
  ]

  const PLAN_LABELS: Record<CaloriePlan, string> = {
    relaxed: t('onboarding.plan-relaxed'),
    steady: t('onboarding.plan-steady'),
    accelerated: t('onboarding.plan-accelerated')
  }

  const form = useForm({
    defaultValues: {
      birthday: data.birthday,
      height: data.height,
      gender: data.gender,
      plan: data.plan
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
                  <Input
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
                <Field data-invalid={isInvalid}>
                  <FieldLabel>{t('onboarding.gender')}</FieldLabel>
                  <div className='grid grid-cols-3 gap-2'>
                    {GENDER_OPTIONS.map((option) => (
                      <button
                        key={option.value}
                        type='button'
                        onClick={() => {
                          field.handleChange(option.value)
                        }}
                        className={`rounded-xl border px-3 py-2 text-sm transition-colors ${
                          field.state.value === option.value
                            ? 'border-primary bg-primary/10 font-medium text-primary'
                            : 'border-border bg-card text-muted-foreground'
                        }`}
                      >
                        {option.label}
                      </button>
                    ))}
                  </div>
                  {isInvalid && <FieldError errors={field.state.meta.errors} />}
                </Field>
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
                    data.goalWeight
                  )
                  if (!options) return null
                  return (
                    <PlanOptions
                      options={options}
                      selectedPlan={field.state.value}
                      onSelect={field.handleChange}
                      isInvalid={isInvalid}
                      errors={field.state.meta.errors}
                      planLabels={PLAN_LABELS}
                    />
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

type PlanOption = ReturnType<typeof generatePlanOptions>[number]

type PlanOptionsProps = {
  options: PlanOption[]
  selectedPlan: CaloriePlan
  onSelect: (plan: CaloriePlan) => void
  isInvalid: boolean
  errors: Array<{ message?: string } | undefined>
  planLabels: Record<CaloriePlan, string>
}

function PlanOptions(props: PlanOptionsProps) {
  const { options, selectedPlan, onSelect, isInvalid, errors, planLabels } = props
  const t = useTranslations()

  return (
    <Field data-invalid={isInvalid}>
      <FieldLabel>{t('onboarding.choose-plan')}</FieldLabel>
      <div className='flex flex-col gap-2'>
        {options.map((option) => (
          <button
            key={option.plan}
            type='button'
            onClick={() => {
              onSelect(option.plan)
            }}
            className={`rounded-xl border p-3 text-left transition-colors ${
              selectedPlan === option.plan ? 'border-primary bg-primary/10' : 'border-border bg-card'
            }`}
          >
            <div className='flex items-center justify-between'>
              <span className='font-medium'>{planLabels[option.plan]}</span>
              <span className='text-sm font-semibold text-primary'>
                {t('onboarding.calories-per-day', { calories: option.calories })}
              </span>
            </div>
            <p className='mt-1 text-xs text-muted-foreground'>
              {t('onboarding.plan-details', { weeklyLoss: option.weeklyLoss, weeks: option.weeksToGoal })}
            </p>
          </button>
        ))}
      </div>
      {isInvalid && <FieldError errors={errors} />}
    </Field>
  )
}
