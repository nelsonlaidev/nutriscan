'use client'

import { CaretRightIcon, ChatTextIcon } from '@phosphor-icons/react/ssr'
import { useForm } from '@tanstack/react-form'
import { useTranslations } from 'next-intl'
import { useState } from 'react'
import { toast } from 'sonner'

import { sendFeedback } from '@/actions/send-feedback'
import { MAX_FEEDBACK_LENGTH } from '@/lib/constants'
import { SendFeedbackSchema } from '@/lib/zod-schemas'

import { Button } from '../ui/button'
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from '../ui/dialog'
import { Field, FieldError, FieldGroup, FieldLabel } from '../ui/field'
import { Spinner } from '../ui/spinner'
import { Textarea } from '../ui/textarea'

export function Feedback() {
  const t = useTranslations()
  const [open, setOpen] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)

  const form = useForm({
    defaultValues: { message: '' },
    validators: { onSubmit: SendFeedbackSchema },
    onSubmit: async ({ value }) => {
      setIsSubmitting(true)
      const result = await sendFeedback({ message: value.message.trim() })
      setIsSubmitting(false)

      if (result.data?.success) {
        toast.success(t('settings.feedback-success'))
        form.reset()
        setOpen(false)
      } else {
        toast.error(t('settings.feedback-error'))
      }
    },
  })

  return (
    <>
      <button
        type='button'
        onClick={() => {
          setOpen(true)
        }}
        className='flex h-9 w-full items-center justify-between'
      >
        <div className='flex items-center gap-2'>
          <ChatTextIcon size={20} />
          <span className='text-base'>{t('settings.feedback')}</span>
        </div>
        <CaretRightIcon size={20} className='text-muted-foreground' />
      </button>
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{t('settings.feedback')}</DialogTitle>
          </DialogHeader>
          <form
            onSubmit={(e) => {
              e.preventDefault()
              void form.handleSubmit()
            }}
          >
            <FieldGroup>
              <form.Field name='message'>
                {(field) => {
                  const isInvalid = field.state.meta.isTouched && !field.state.meta.isValid
                  return (
                    <Field data-invalid={isInvalid}>
                      <FieldLabel htmlFor={field.name}>{t('settings.feedback-placeholder')}</FieldLabel>
                      <Textarea
                        id={field.name}
                        name={field.name}
                        value={field.state.value}
                        onBlur={field.handleBlur}
                        onChange={(e) => {
                          field.handleChange(e.target.value)
                        }}
                        aria-invalid={isInvalid}
                        maxLength={MAX_FEEDBACK_LENGTH}
                        rows={4}
                      />
                      <div className='flex items-center justify-between'>
                        {isInvalid ? <FieldError errors={field.state.meta.errors} /> : <span />}
                        <p className='text-xs text-muted-foreground'>
                          {field.state.value.length}/{MAX_FEEDBACK_LENGTH}
                        </p>
                      </div>
                    </Field>
                  )
                }}
              </form.Field>
            </FieldGroup>
            <DialogFooter className='mt-4'>
              <Button type='submit' disabled={isSubmitting}>
                {isSubmitting && <Spinner data-icon='inline-start' />}
                {t('settings.feedback-submit')}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </>
  )
}
