'use client'

import { EnvelopeSimpleIcon, LockIcon, SpinnerGapIcon, UserCircleIcon } from '@phosphor-icons/react/ssr'
import { useForm } from '@tanstack/react-form'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useTranslations } from 'next-intl'
import { useState } from 'react'
import { toast } from 'sonner'

import { AuthHeader } from '@/components/auth-header'
import { Button } from '@/components/ui/button'
import { Field, FieldError, FieldGroup, FieldLabel } from '@/components/ui/field'
import { InputGroup, InputGroupAddon, InputGroupInput } from '@/components/ui/input-group'
import { signUp } from '@/lib/auth-client'
import { DEFAULT_CURRENT_WEIGHT, DEFAULT_GOAL_WEIGHT, DEFAULT_HEIGHT } from '@/lib/constants'
import { createSignUpFormSchema } from '@/lib/zod-schemas'

export default function Page() {
  const t = useTranslations()
  const router = useRouter()
  const [isSubmitting, setIsSubmitting] = useState(false)

  const form = useForm({
    defaultValues: {
      name: '',
      email: '',
      password: '',
      confirmPassword: ''
    },
    validators: {
      onSubmit: createSignUpFormSchema(t)
    },
    onSubmit: ({ value }) => {
      void signUp.email(
        {
          email: value.email,
          password: value.password,
          name: value.name,
          startingWeight: DEFAULT_CURRENT_WEIGHT,
          currentWeight: DEFAULT_CURRENT_WEIGHT,
          goalWeight: DEFAULT_GOAL_WEIGHT,
          height: DEFAULT_HEIGHT,
          birthday: '',
          gender: ''
        },
        {
          onRequest: () => {
            setIsSubmitting(true)
          },
          onSuccess: () => {
            toast.success(t('auth.success-account-created'))
            router.push('/onboarding')
            setIsSubmitting(false)
          },
          onError: (ctx) => {
            toast.error(ctx.error.message || t('auth.error-create-account'))
            setIsSubmitting(false)
          }
        }
      )
    }
  })

  return (
    <div className='flex w-full max-w-sm flex-col items-center justify-center gap-8'>
      <AuthHeader title={t('auth.create-account')} description={t('auth.create-account-description')} />

      <form
        onSubmit={(e) => {
          e.preventDefault()
          void form.handleSubmit()
        }}
        className='flex w-full flex-col gap-8'
      >
        <FieldGroup>
          <form.Field name='name'>
            {(field) => {
              const isInvalid = field.state.meta.isTouched && !field.state.meta.isValid
              return (
                <Field data-invalid={isInvalid}>
                  <FieldLabel htmlFor={field.name}>{t('auth.display-name')}</FieldLabel>
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
                      placeholder={t('auth.display-name-placeholder')}
                      disabled={isSubmitting}
                    />
                    <InputGroupAddon align='inline-start'>
                      <UserCircleIcon className='text-muted-foreground' />
                    </InputGroupAddon>
                  </InputGroup>
                  {isInvalid && <FieldError errors={field.state.meta.errors} />}
                </Field>
              )
            }}
          </form.Field>

          <form.Field name='email'>
            {(field) => {
              const isInvalid = field.state.meta.isTouched && !field.state.meta.isValid
              return (
                <Field data-invalid={isInvalid}>
                  <FieldLabel htmlFor={field.name}>{t('auth.email')}</FieldLabel>
                  <InputGroup>
                    <InputGroupInput
                      id={field.name}
                      name={field.name}
                      value={field.state.value}
                      type='email'
                      onBlur={field.handleBlur}
                      onChange={(e) => {
                        field.handleChange(e.target.value)
                      }}
                      aria-invalid={isInvalid}
                      placeholder={t('auth.email-placeholder')}
                      disabled={isSubmitting}
                    />
                    <InputGroupAddon align='inline-start'>
                      <EnvelopeSimpleIcon className='text-muted-foreground' />
                    </InputGroupAddon>
                  </InputGroup>
                  {isInvalid && <FieldError errors={field.state.meta.errors} />}
                </Field>
              )
            }}
          </form.Field>

          <form.Field name='password'>
            {(field) => {
              const isInvalid = field.state.meta.isTouched && !field.state.meta.isValid
              return (
                <Field data-invalid={isInvalid}>
                  <FieldLabel htmlFor={field.name}>{t('auth.password')}</FieldLabel>
                  <InputGroup>
                    <InputGroupInput
                      id={field.name}
                      name={field.name}
                      value={field.state.value}
                      type='password'
                      onBlur={field.handleBlur}
                      onChange={(e) => {
                        field.handleChange(e.target.value)
                      }}
                      aria-invalid={isInvalid}
                      placeholder={t('auth.password-placeholder')}
                      disabled={isSubmitting}
                    />
                    <InputGroupAddon align='inline-start'>
                      <LockIcon className='text-muted-foreground' />
                    </InputGroupAddon>
                  </InputGroup>
                  {isInvalid && <FieldError errors={field.state.meta.errors} />}
                </Field>
              )
            }}
          </form.Field>

          <form.Field name='confirmPassword'>
            {(field) => {
              const isInvalid = field.state.meta.isTouched && !field.state.meta.isValid
              return (
                <Field data-invalid={isInvalid}>
                  <FieldLabel htmlFor={field.name}>{t('auth.confirm-password')}</FieldLabel>
                  <InputGroup>
                    <InputGroupInput
                      id={field.name}
                      name={field.name}
                      value={field.state.value}
                      type='password'
                      onBlur={field.handleBlur}
                      onChange={(e) => {
                        field.handleChange(e.target.value)
                      }}
                      aria-invalid={isInvalid}
                      placeholder={t('auth.confirm-password-placeholder')}
                      disabled={isSubmitting}
                    />
                    <InputGroupAddon align='inline-start'>
                      <LockIcon className='text-muted-foreground' />
                    </InputGroupAddon>
                  </InputGroup>
                  {isInvalid && <FieldError errors={field.state.meta.errors} />}
                </Field>
              )
            }}
          </form.Field>
        </FieldGroup>

        <Button type='submit' disabled={isSubmitting}>
          {isSubmitting && <SpinnerGapIcon className='animate-spin' />}
          {t('auth.sign-up')}
        </Button>
      </form>

      <p className='text-center text-sm text-muted-foreground'>
        {t('auth.has-account')}{' '}
        <Link href='/auth/sign-in' className='text-foreground hover:underline'>
          {t('auth.sign-in')}
        </Link>
      </p>
    </div>
  )
}
