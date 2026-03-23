'use client'

import { EnvelopeSimpleIcon, LockIcon, SpinnerGapIcon } from '@phosphor-icons/react/ssr'
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
import { signIn } from '@/lib/auth-client'
import { createSignInFormSchema } from '@/lib/zod-schemas'

export default function Page() {
  const t = useTranslations()
  const router = useRouter()
  const [isSubmitting, setIsSubmitting] = useState(false)

  const form = useForm({
    defaultValues: {
      email: '',
      password: '',
    },
    validators: {
      onSubmit: createSignInFormSchema(t),
    },
    onSubmit: ({ value }) => {
      void signIn.email(
        {
          email: value.email,
          password: value.password,
        },
        {
          onRequest: () => {
            setIsSubmitting(true)
          },
          onSuccess: () => {
            toast.success(t('auth.success-signed-in'))
            router.push('/dashboard')
            setIsSubmitting(false)
          },
          onError: (ctx) => {
            toast.error(ctx.error.message || t('auth.error-sign-in'))
            setIsSubmitting(false)
          },
        },
      )
    },
  })

  return (
    <div className='flex w-full max-w-sm flex-col items-center justify-center gap-8'>
      <AuthHeader title={t('auth.app-name')} description={t('auth.tagline')} />

      <form
        onSubmit={(e) => {
          e.preventDefault()
          void form.handleSubmit()
        }}
        className='flex w-full flex-col gap-8'
      >
        <FieldGroup>
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
                  <div className='flex justify-end'>
                    <Link
                      href='/auth/forgot-password'
                      className='text-sm text-muted-foreground transition-colors hover:text-foreground hover:underline'
                    >
                      {t('auth.forgot-password')}
                    </Link>
                  </div>
                </Field>
              )
            }}
          </form.Field>
        </FieldGroup>

        <Button type='submit' disabled={isSubmitting}>
          {isSubmitting && <SpinnerGapIcon className='animate-spin' />}
          {t('auth.sign-in')}
        </Button>
      </form>

      <p className='text-center text-sm text-muted-foreground'>
        {t('auth.no-account')}{' '}
        <Link href='/auth/sign-up' className='text-foreground hover:underline'>
          {t('auth.sign-up')}
        </Link>
      </p>
    </div>
  )
}
