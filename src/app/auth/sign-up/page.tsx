'use client'

import { EnvelopeSimpleIcon, LockIcon, SpinnerGapIcon, UserIcon } from '@phosphor-icons/react'
import { useForm } from '@tanstack/react-form'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useState } from 'react'
import { toast } from 'sonner'

import AuthHeader from '@/components/auth-header'
import { Button } from '@/components/ui/button'
import { Field, FieldError, FieldGroup, FieldLabel } from '@/components/ui/field'
import { InputGroup, InputGroupAddon, InputGroupInput } from '@/components/ui/input-group'
import { signUp } from '@/lib/auth-client'
import { SignUpFormSchema } from '@/lib/zod-schemas'

function Page() {
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
      onSubmit: SignUpFormSchema
    },
    onSubmit: ({ value }) => {
      signUp.email(
        {
          email: value.email,
          password: value.password,
          name: value.name
        },
        {
          onRequest: () => {
            setIsSubmitting(true)
          },
          onSuccess: () => {
            toast.success('Account created successfully')
            router.push('/onboarding')
            setIsSubmitting(false)
          },
          onError: (ctx) => {
            toast.error(ctx.error.message || 'Failed to create account')
            setIsSubmitting(false)
          }
        }
      )
    }
  })

  return (
    <div className='flex w-full max-w-sm flex-col items-center justify-center gap-8'>
      <AuthHeader title='Create Account' description='Sign up to start tracking your nutrition' />

      <form
        onSubmit={(e) => {
          e.preventDefault()
          form.handleSubmit()
        }}
        className='flex w-full flex-col gap-8'
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
                      placeholder='John Doe'
                      disabled={isSubmitting}
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
                </Field>
              )
            }}
          </form.Field>

          <form.Field name='confirmPassword'>
            {(field) => {
              const isInvalid = field.state.meta.isTouched && !field.state.meta.isValid
              return (
                <Field data-invalid={isInvalid}>
                  <FieldLabel htmlFor={field.name}>Confirm Password</FieldLabel>
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
                      placeholder='Re-enter your password'
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
          Sign Up
        </Button>
      </form>

      <p className='text-center text-sm text-muted-foreground'>
        Already have an account?{' '}
        <Link href='/auth/sign-in' className='text-foreground hover:underline'>
          Sign In
        </Link>
      </p>
    </div>
  )
}

export default Page
