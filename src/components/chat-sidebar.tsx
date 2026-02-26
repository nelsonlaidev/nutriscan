import { PlusIcon, TrashIcon } from '@phosphor-icons/react/ssr'
import { formatDistanceToNow } from 'date-fns'
import Link from 'next/link'
import { useTranslations } from 'next-intl'
import { useAction } from 'next-safe-action/hooks'
import { useEffect } from 'react'
import { toast } from 'sonner'

import { deleteChat } from '@/actions/chat'
import { useChat } from '@/contexts/chat'
import { cn } from '@/lib/utils'

import { Button } from './ui/button'

type ChatSidebarProps = {
  open: boolean
  onOpenChange: (open: boolean) => void
  onNewChat: () => void
}

export function ChatSidebar(props: ChatSidebarProps) {
  const { open, onOpenChange, onNewChat } = props
  const { chats } = useChat()
  const t = useTranslations()

  const { execute: executeDelete } = useAction(deleteChat, {
    onSuccess: () => {
      toast.success(t('chat.deleted'))
    },
    onError: () => {
      toast.error(t('chat.delete-failed'))
    }
  })

  useEffect(() => {
    if (!open) return

    function onKeyDown(e: KeyboardEvent) {
      if (e.key === 'Escape') {
        onOpenChange(false)
      }
    }

    document.addEventListener('keydown', onKeyDown)
    return () => {
      document.removeEventListener('keydown', onKeyDown)
    }
  }, [open, onOpenChange])

  return (
    <>
      {/* Backdrop */}
      <div
        className={cn(
          'absolute inset-0 z-40 bg-black/50 transition-opacity duration-200',
          open ? 'opacity-100' : 'pointer-events-none opacity-0'
        )}
        onClick={() => {
          onOpenChange(false)
        }}
        aria-hidden='true'
      />

      {/* Panel */}
      <div
        role='dialog'
        aria-label={t('chat.history')}
        className={cn(
          'absolute inset-y-0 left-0 z-50 flex w-3/4 max-w-sm flex-col border-r bg-background transition-transform duration-200 ease-in-out',
          open ? 'translate-x-0' : '-translate-x-full'
        )}
      >
        <div className='flex items-center justify-between p-4'>
          <h2 className='text-base font-medium'>{t('chat.history')}</h2>
          <Button variant='ghost' size='icon-sm' onClick={onNewChat}>
            <PlusIcon className='size-5' />
          </Button>
        </div>
        <div className='flex-1 overflow-y-auto px-4 pb-4'>
          {chats.length === 0 ? (
            <p className='text-sm text-muted-foreground'>{t('chat.no-chats')}</p>
          ) : (
            <ul className='space-y-1'>
              {chats.map((chat) => (
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
                  <Button
                    variant='ghost'
                    size='icon'
                    className='shrink-0'
                    onClick={() => {
                      executeDelete({ chatId: chat.id })
                    }}
                  >
                    <TrashIcon />
                  </Button>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </>
  )
}
