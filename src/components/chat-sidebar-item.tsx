import type { ListChatOutput } from '@/orpc/client'

import { PencilIcon, TrashIcon } from '@phosphor-icons/react'
import { useForm } from '@tanstack/react-form'
import { formatDistanceToNow } from 'date-fns'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useTranslations } from 'next-intl'
import { useState } from 'react'
import { toast } from 'sonner'

import { useDeleteChat, useUpdateChatTitle } from '@/hooks/queries/chat.query'
import { createChatTitleFormSchema } from '@/lib/zod-schemas'

import { Button } from './ui/button'
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from './ui/dialog'
import { Field, FieldDescription, FieldError, FieldGroup, FieldLabel } from './ui/field'
import { Input } from './ui/input'
import { Spinner } from './ui/spinner'

type ChatSidebarItemProps = {
  chat: ListChatOutput[number]
  currentChatId: string
  onOpenChange: (open: boolean) => void
}

export function ChatSidebarItem(props: ChatSidebarItemProps) {
  const { chat, currentChatId, onOpenChange } = props
  const t = useTranslations()
  const router = useRouter()

  const [editDialogOpen, setEditDialogOpen] = useState(false)
  const chatTitleFormSchema = createChatTitleFormSchema(t)

  const { mutate: deleteChat } = useDeleteChat((id) => {
    toast.success(t('chat.deleted'), { testId: 'chat-deleted-toast' })
    if (currentChatId === id) {
      router.push('/chat')
    }
  })

  const { mutate: updateTitle, isPending: isSavingTitle } = useUpdateChatTitle(() => {
    setEditDialogOpen(false)
    toast.success(t('chat.title-updated'), { testId: 'chat-title-updated-toast' })
  })

  const form = useForm({
    defaultValues: {
      title: chat.title,
    },
    validators: {
      onSubmit: chatTitleFormSchema,
    },
    onSubmit: ({ value }) => {
      const title = value.title.trim()

      if (title === chat.title) {
        setEditDialogOpen(false)
        return
      }

      updateTitle(
        { chatId: chat.id, title },
        {
          onError: () => {
            toast.error(t('chat.title-update-failed'), { testId: 'chat-title-update-error-toast' })
          },
        },
      )
    },
  })

  return (
    <li key={chat.id} className='flex items-center gap-2'>
      <Link
        href={`/chat/${chat.id}`}
        onClick={() => {
          onOpenChange(false)
        }}
        className='flex min-w-0 flex-1 flex-col rounded-lg px-3 py-2 hover:bg-muted'
      >
        <span className='truncate text-sm font-medium'>{chat.title}</span>
        <span className='text-xs text-muted-foreground'>
          {formatDistanceToNow(chat.updatedAt, { addSuffix: true })}
        </span>
      </Link>
      <div className='flex items-center gap-1'>
        <Dialog
          open={editDialogOpen}
          onOpenChange={(open) => {
            setEditDialogOpen(open)
            if (open) {
              form.reset({ title: chat.title })
            }
          }}
        >
          <DialogTrigger
            render={
              <Button variant='ghost' size='icon' className='shrink-0' data-testid={`edit-chat-${chat.id}`}>
                <PencilIcon />
              </Button>
            }
          />
          <DialogContent showCloseButton={false}>
            <DialogHeader>
              <DialogTitle>{t('chat.edit-title')}</DialogTitle>
              <DialogDescription>{t('chat.edit-description')}</DialogDescription>
            </DialogHeader>
            <form
              onSubmit={(e) => {
                e.preventDefault()
                void form.handleSubmit()
              }}
              id={`edit-chat-title-form-${chat.id}`}
            >
              <FieldGroup>
                <form.Field name='title'>
                  {(field) => {
                    const isInvalid = field.state.meta.isTouched && !field.state.meta.isValid

                    return (
                      <Field data-invalid={isInvalid}>
                        <FieldLabel htmlFor={field.name}>{t('chat.title-label')}</FieldLabel>
                        <Input
                          id={field.name}
                          name={field.name}
                          data-testid={`edit-chat-input-${chat.id}`}
                          value={field.state.value}
                          onBlur={field.handleBlur}
                          onChange={(e) => {
                            field.handleChange(e.target.value)
                          }}
                          aria-invalid={isInvalid}
                          placeholder={t('chat.title-placeholder')}
                          disabled={isSavingTitle}
                          // eslint-disable-next-line jsx-a11y/no-autofocus
                          autoFocus
                        />
                        <FieldDescription>{t('chat.title-description')}</FieldDescription>
                        {isInvalid && <FieldError errors={field.state.meta.errors} />}
                      </Field>
                    )
                  }}
                </form.Field>
              </FieldGroup>
            </form>
            <DialogFooter>
              <DialogClose render={<Button variant='outline' disabled={isSavingTitle} />}>
                {t('chat.cancel')}
              </DialogClose>
              <Button
                type='submit'
                form={`edit-chat-title-form-${chat.id}`}
                disabled={isSavingTitle}
                data-testid={`save-chat-${chat.id}`}
              >
                {isSavingTitle && <Spinner data-icon='inline-start' />}
                {isSavingTitle ? t('chat.saving') : t('chat.save')}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
        <Button
          variant='ghost'
          size='icon'
          className='shrink-0'
          data-testid={`delete-chat-${chat.id}`}
          onClick={() => {
            deleteChat(
              { chatId: chat.id },
              {
                onError: () => {
                  toast.error(t('chat.delete-failed'))
                },
              },
            )
          }}
        >
          <TrashIcon />
        </Button>
      </div>
    </li>
  )
}
