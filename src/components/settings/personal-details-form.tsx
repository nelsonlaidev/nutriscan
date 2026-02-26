'use client'

import type { CaloriePlan, Gender } from '@/lib/calculations'

import { BarbellIcon, CalendarBlankIcon, RulerIcon, TargetIcon } from '@phosphor-icons/react/ssr'
import { useForm } from '@tanstack/react-form'
import { useRouter } from 'next/navigation'
import { useTranslations } from 'next-intl'
import { useAction } from 'next-safe-action/hooks'
import { toast } from 'sonner'

import { updatePersonalDetails } from '@/actions/update-personal-details'
import { Button } from '@/components/ui/button'
import {
  calculateAge,
  calculateBMR,
  calculateCalorieBudget,
  calculateMacros,
  calculateTDEE,
  generatePlanOptions
} from '@/lib/calculations'
import { onActionError } from '@/lib/safe-action-utils'
import { useSession } from '@/lib/session'
import { createPersonalDetailsFormSchema } from '@/lib/zod-schemas'

import {
  Field,
  FieldContent,
  FieldDescription,
  FieldError,
  FieldGroup,
  FieldLabel,
  FieldLegend,
  FieldSet,
  FieldTitle
} from '../ui/field'
import { InputGroup, InputGroupAddon, InputGroupInput } from '../ui/input-group'
import { RadioGroup, RadioGroupItem } from '../ui/radio-group'

const FORM_ID = 'personal-details-form'

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

export function PersonalDetailsForm() {
  const { user } = useSession()
  const router = useRouter()
  const t = useTranslations()

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

  const { execute, isPending } = useAction(updatePersonalDetails, {
    onSuccess: () => {
      toast.success(t('settings.personal-details.success'))
      // Refresh to get updated session
      router.refresh()
      router.back()
    },
    onError: (error) => {
      onActionError(error)
      toast.error(t('settings.personal-details.error'))
    }
  })

  const form = useForm({
    defaultValues: {
      currentWeight: user.currentWeight as number | '',
      goalWeight: user.goalWeight as number | '',
      height: user.height as number | '',
      birthday: user.birthday,
      gender: user.gender as Gender,
      plan: 'steady' as CaloriePlan // Default to steady as we don't store plan
    },
    validators: {
      onSubmit: createPersonalDetailsFormSchema(t)
    },
    onSubmit: ({ value }) => {
      const age = calculateAge(value.birthday)
      const bmr = calculateBMR(value.currentWeight as number, value.height as number, age, value.gender)
      const tdee = calculateTDEE(bmr)
      const calories = calculateCalorieBudget(tdee, value.plan)
      const macros = calculateMacros(calories)

      execute({
        currentWeight: value.currentWeight as number,
        goalWeight: value.goalWeight as number,
        height: value.height as number,
        birthday: value.birthday,
        gender: value.gender,
        calorieBudget: calories,
        proteinTarget: macros.protein,
        carbTarget: macros.carbs,
        fatTarget: macros.fat
      })
    }
  })

  return (
    <form
      id={FORM_ID}
      onSubmit={(e) => {
        e.preventDefault()
        void form.handleSubmit()
      }}
      className='flex flex-col gap-6'
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
                          aria-label={option.label}
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
                  values.currentWeight,
                  values.goalWeight
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
                                  weeks: option.weeksToGoal
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

      <Button type='submit' className='mt-4 w-full' disabled={isPending}>
        {isPending ? t('settings.personal-details.saving') : t('settings.personal-details.save')}
      </Button>
    </form>
  )
}
