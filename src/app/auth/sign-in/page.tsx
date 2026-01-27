'use client'

import { EnvelopeSimpleIcon, LockIcon, SpinnerGapIcon } from '@phosphor-icons/react'
import { useForm } from '@tanstack/react-form'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useState } from 'react'
import { toast } from 'sonner'

import AuthHeader from '@/components/auth-header'
import { Button } from '@/components/ui/button'
import { Field, FieldError, FieldGroup, FieldLabel } from '@/components/ui/field'
import { InputGroup, InputGroupAddon, InputGroupInput } from '@/components/ui/input-group'
import { signIn } from '@/lib/auth-client'
import { SignInFormSchema } from '@/lib/zod-schemas'

function Page() {
  const router = useRouter()
  const [isSubmitting, setIsSubmitting] = useState(false)

  const form = useForm({
    defaultValues: {
      email: '',
      password: ''
    },
    validators: {
      onSubmit: SignInFormSchema
    },
    onSubmit: ({ value }) => {
      signIn.email(
        {
          email: value.email,
          password: value.password
        },
        {
          onRequest: () => {
            setIsSubmitting(true)
          },
          onSuccess: () => {
            toast.success('Signed in successfully')
            router.push('/dashboard')
            setIsSubmitting(false)
          },
          onError: (ctx) => {
            toast.error(ctx.error.message || 'Failed to sign in')
            setIsSubmitting(false)
          }
        }
      )
    }
  })

  return (
    <div className='flex w-full max-w-sm flex-col items-center justify-center gap-8'>
      <AuthHeader title='NutriScan' description='Track your nutrition, reach your goals' />

      <form
        onSubmit={(e) => {
          e.preventDefault()
          form.handleSubmit()
        }}
        className='flex w-full flex-col gap-8'
      >
        <FieldGroup>
          <form.Field name='email'>
            {(field) => {
              const isInvalid = field.state.meta.isTouched && !field.state.meta.isValid
              return (
                <Field data-invalid={isInvalid}>
                  <FieldLabel htmlFor={field.name}>Email</FieldLabel>
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
                      placeholder='john@example.com'
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
                  <FieldLabel htmlFor={field.name}>Password</FieldLabel>
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
                      placeholder='Enter your password'
                      disabled={isSubmitting}
                    />
                    <InputGroupAddon align='inline-start'>
                      <LockIcon className='text-muted-foreground' />
                    </InputGroupAddon>
                  </InputGroup>
                  {isInvalid && <FieldError errors={field.state.meta.errors} />}
                  <Link
                    href='/auth/forgot-password'
                    className='text-right text-sm text-muted-foreground transition-colors hover:text-foreground hover:underline'
                  >
                    Forgot password?
                  </Link>
                </Field>
              )
            }}
          </form.Field>
        </FieldGroup>

        <Button type='submit' disabled={isSubmitting}>
          {isSubmitting && <SpinnerGapIcon className='animate-spin' />}
          Sign In
        </Button>
      </form>

      <p className='text-center text-sm text-muted-foreground'>
        Don&apos;t have an account?{' '}
        <Link href='/auth/sign-up' className='text-foreground hover:underline'>
          Sign Up
        </Link>
      </p>
    </div>
  )
}

export default Page
