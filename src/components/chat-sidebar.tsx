import { PlusIcon } from '@phosphor-icons/react/ssr'
import { useTranslations } from 'next-intl'
import { useEffect } from 'react'

import { useChats } from '@/hooks/queries/chat.query'
import { cn } from '@/lib/utils'

import { ChatSidebarItem } from './chat-sidebar-item'
import { Button } from './ui/button'

type ChatSidebarProps = {
  currentChatId: string
  open: boolean
  onOpenChange: (open: boolean) => void
  onNewChat: () => void
}

export function ChatSidebar(props: ChatSidebarProps) {
  const { currentChatId, open, onOpenChange, onNewChat } = props
  const { data: chats } = useChats()
  const t = useTranslations()

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
          open ? 'opacity-100' : 'pointer-events-none opacity-0',
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
          open ? 'translate-x-0' : '-translate-x-full',
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
                <ChatSidebarItem key={chat.id} currentChatId={currentChatId} chat={chat} onOpenChange={onOpenChange} />
              ))}
            </ul>
          )}
        </div>
      </div>
    </>
  )
}
