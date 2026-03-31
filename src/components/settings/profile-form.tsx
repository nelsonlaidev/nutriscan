'use client'

import { EnvelopeSimpleIcon, SpinnerGapIcon, UploadSimpleIcon, UserCircleIcon } from '@phosphor-icons/react/ssr'
import { useForm } from '@tanstack/react-form'
import imageCompression from 'browser-image-compression'
import { useRouter } from 'next/navigation'
import { useTranslations } from 'next-intl'
import { useCallback, useEffect, useRef, useState } from 'react'
import { toast } from 'sonner'

import { Button } from '@/components/ui/button'
import { Field, FieldDescription, FieldError, FieldGroup, FieldLabel } from '@/components/ui/field'
import { InputGroup, InputGroupAddon, InputGroupInput } from '@/components/ui/input-group'
import { useUploadImage } from '@/hooks/queries/r2.query'
import { updateUser } from '@/lib/auth-client'
import { blobToBase64 } from '@/lib/blob'
import { createProfileFormSchema } from '@/lib/zod-schemas'

import { UserAvatar } from '../user-avatar'

const SUPPORTED_IMAGE_TYPES = ['image/jpeg', 'image/png', 'image/webp', 'image/gif'] as const

type ProfileFormProps = {
  user: { id: string; name: string; email: string; image?: string | null }
}

export function ProfileForm({ user }: ProfileFormProps) {
  const t = useTranslations()
  const router = useRouter()
  const inputRef = useRef<HTMLInputElement>(null)
  const previewRef = useRef<string | null>(null)
  const [avatarUrl, setAvatarUrl] = useState(user.image ?? null)
  const [previewUrl, setPreviewUrl] = useState<string | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)

  const { mutateAsync: uploadImage, isPending: isUploadingAvatar } = useUploadImage()

  useEffect(
    () => () => {
      if (previewRef.current) {
        URL.revokeObjectURL(previewRef.current)
      }
    },
    [],
  )

  const handleAvatarChange = useCallback(
    async (event: React.ChangeEvent<HTMLInputElement>) => {
      const file = event.target.files?.[0]

      if (!file) {
        return
      }

      if (!SUPPORTED_IMAGE_TYPES.includes(file.type as (typeof SUPPORTED_IMAGE_TYPES)[number])) {
        toast.error(t('settings.profile.invalid-avatar-format'))
        event.target.value = ''
        return
      }

      let compressed: File
      try {
        compressed = await imageCompression(file, {
          maxSizeMB: 1,
          maxWidthOrHeight: 1024,
          useWebWorker: true,
        })
      } catch {
        toast.error(t('settings.profile.avatar-processing-error'))
        event.target.value = ''
        return
      }

      if (previewRef.current) {
        URL.revokeObjectURL(previewRef.current)
      }

      const nextPreviewUrl = URL.createObjectURL(compressed)
      previewRef.current = nextPreviewUrl
      setPreviewUrl(nextPreviewUrl)

      try {
        const base64 = await blobToBase64(compressed)
        const { url } = await uploadImage({
          base64,
          mimeType: compressed.type as 'image/jpeg' | 'image/png' | 'image/webp' | 'image/gif',
          type: 'avatar',
        })

        setAvatarUrl(url)
      } catch (error) {
        toast.error(error instanceof Error ? error.message : t('settings.profile.avatar-upload-error'))
        setPreviewUrl(null)
        setAvatarUrl(user.image ?? null)
      } finally {
        event.target.value = ''
      }
    },
    [t, uploadImage, user.image],
  )

  const form = useForm({
    defaultValues: {
      name: user.name,
    },
    validators: {
      onSubmit: createProfileFormSchema(t),
    },
    onSubmit: async ({ value }) => {
      setIsSubmitting(true)

      try {
        const result = await updateUser({
          name: value.name,
          image: avatarUrl,
        })

        if (result.error) {
          toast.error(result.error.message ?? t('settings.profile.retry'))
          return
        }

        toast.success(t('settings.profile.success'))
        router.replace('/settings')
      } catch {
        toast.error(t('settings.profile.retry'))
      } finally {
        setIsSubmitting(false)
      }
    },
  })

  const isBusy = isSubmitting || isUploadingAvatar

  return (
    <form
      onSubmit={(event) => {
        event.preventDefault()
        void form.handleSubmit()
      }}
      className='flex flex-col gap-6'
    >
      <div className='flex flex-col items-center gap-4 rounded-2xl bg-card px-6 py-8 ring-1 ring-foreground/10'>
        <UserAvatar user={{ ...user, image: previewUrl ?? avatarUrl }} className='size-24' />

        <div className='flex flex-col items-center gap-1 text-center'>
          <p className='text-base font-medium'>{t('settings.profile.avatar')}</p>
          <p className='text-sm text-muted-foreground'>{t('settings.profile.avatar-description')}</p>
        </div>

        <input ref={inputRef} type='file' accept='image/*' className='hidden' onChange={handleAvatarChange} />

        <Button type='button' variant='outline' onClick={() => inputRef.current?.click()} disabled={isBusy}>
          {isUploadingAvatar ? <SpinnerGapIcon className='animate-spin' /> : <UploadSimpleIcon />}
          {avatarUrl ? t('settings.profile.change-avatar') : t('settings.profile.upload-avatar')}
        </Button>
      </div>

      <FieldGroup>
        <form.Field name='name'>
          {(field) => {
            const isInvalid = field.state.meta.isTouched && !field.state.meta.isValid

            return (
              <Field data-invalid={isInvalid}>
                <FieldLabel htmlFor={field.name}>{t('settings.profile.name')}</FieldLabel>
                <InputGroup>
                  <InputGroupInput
                    id={field.name}
                    name={field.name}
                    value={field.state.value}
                    type='text'
                    onBlur={field.handleBlur}
                    onChange={(event) => {
                      field.handleChange(event.target.value)
                    }}
                    aria-invalid={isInvalid}
                    disabled={isBusy}
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

        <Field>
          <FieldLabel htmlFor='profile-email'>{t('settings.profile.email')}</FieldLabel>
          <InputGroup>
            <InputGroupInput id='profile-email' type='email' value={user.email} disabled readOnly />
            <InputGroupAddon align='inline-start'>
              <EnvelopeSimpleIcon className='text-muted-foreground' />
            </InputGroupAddon>
          </InputGroup>
          <FieldDescription>{t('settings.profile.email-description')}</FieldDescription>
        </Field>
      </FieldGroup>

      <Button type='submit' disabled={isBusy}>
        {isSubmitting && <SpinnerGapIcon className='animate-spin' />}
        {isSubmitting ? t('settings.profile.saving') : t('settings.profile.save')}
      </Button>
    </form>
  )
}
