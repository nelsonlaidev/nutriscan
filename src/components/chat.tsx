'use client'

import type { Chats } from '@/actions/chat'
import type { FileUIPart, UIMessage } from 'ai'

import 'katex/dist/katex.min.css'

import { useChat } from '@ai-sdk/react'
import {
  ArrowDownIcon,
  ArrowUpIcon,
  CameraIcon,
  ListIcon,
  PlusIcon,
  SpinnerGapIcon,
  XIcon
} from '@phosphor-icons/react/ssr'
import { DefaultChatTransport } from 'ai'
import { useRouter } from 'next/navigation'
import { useTranslations } from 'next-intl'
import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { toast } from 'sonner'
import { useStickToBottom } from 'use-stick-to-bottom'

import { getChatTitle } from '@/actions/chat'
import { ChatProvider } from '@/contexts/chat'
import { uploadImage } from '@/lib/upload'

import { ChatSidebar } from './chat-sidebar'
import { ChatWelcome } from './chat-welcome'
import { MainLayout } from './main-layout'
import { Response } from './response'
import { Button } from './ui/button'
import { InputGroup, InputGroupAddon, InputGroupButton, InputGroupInput } from './ui/input-group'

type ChatProps = {
  id: string
  isNewChat: boolean
  chats: Chats
  chatTitle?: string
  initialMessages?: UIMessage[]
}

const EMPTY_MESSAGES: UIMessage[] = []

export function Chat(props: ChatProps) {
  const { id, isNewChat, chats, chatTitle, initialMessages = EMPTY_MESSAGES } = props

  const t = useTranslations()
  const [input, setInput] = useState('')
  const [uploadedFiles, setUploadedFiles] = useState<FileUIPart[]>([])
  const [uploading, setUploading] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const router = useRouter()
  const { contentRef, scrollRef, scrollToBottom, isAtBottom } = useStickToBottom({ resize: 'smooth' })

  const [title, setTitle] = useState(() => chatTitle ?? t('nav.chat'))

  const transport = useMemo(() => new DefaultChatTransport({ body: { chatId: id } }), [id])

  const { messages, sendMessage, status } = useChat({
    id,
    messages: initialMessages.length > 0 ? initialMessages : undefined,
    transport
  })

  const isStreaming = status === 'streaming'
  const isSubmitted = status === 'submitted'
  const isLoading = isSubmitted || isStreaming

  const prevStatusRef = useRef(status)
  useEffect(() => {
    const fetchTitle = async () => {
      const newTitle = await getChatTitle(id)
      if (newTitle) setTitle(newTitle)
    }

    if (prevStatusRef.current === 'streaming' && status === 'ready') {
      void fetchTitle()
    }
    prevStatusRef.current = status
  }, [status, id])

  const handleNewChat = useCallback(() => {
    setSidebarOpen(false)
    router.push('/chat')
  }, [router])

  const persistChatUrl = useCallback(() => {
    if (isNewChat) globalThis.history.pushState({}, '', `/chat/${id}`)
  }, [id, isNewChat])

  const handleSubmit = useCallback(
    (e: React.FormEvent<HTMLFormElement>) => {
      e.preventDefault()

      if (status !== 'ready') {
        toast.error(t('chat.not-ready'))
        return
      }

      if (!input.trim() && uploadedFiles.length === 0) {
        toast.error(t('chat.empty-message'))
        return
      }

      persistChatUrl()

      // eslint-disable-next-line sonarjs/void-use
      void scrollToBottom()

      void sendMessage({
        text: input,
        files: uploadedFiles.length > 0 ? uploadedFiles : undefined
      })

      setInput('')
      setUploadedFiles([])
      if (fileInputRef.current) {
        fileInputRef.current.value = ''
      }
    },
    [input, persistChatUrl, scrollToBottom, sendMessage, status, t, uploadedFiles]
  )

  const handleRemoveFile = useCallback((idx: number) => {
    setUploadedFiles((prev) => prev.filter((_, i) => i !== idx))
    if (fileInputRef.current) {
      fileInputRef.current.value = ''
    }
  }, [])

  const handleFileChange = useCallback(
    async (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0]
      if (!file) return

      const maxSizeBytes = 5 * 1024 * 1024 // 5 MB
      if (file.size > maxSizeBytes) {
        toast.error(t('chat.image-too-large'))
        if (fileInputRef.current) fileInputRef.current.value = ''
        return
      }

      setUploading(true)
      try {
        const url = await uploadImage(file, 'chat')
        setUploadedFiles((prev) => [
          ...prev,
          {
            type: 'file' as const,
            filename: file.name,
            mediaType: file.type,
            url
          }
        ])
      } catch {
        toast.error(t('chat.upload-failed'))
      } finally {
        setUploading(false)
        if (fileInputRef.current) {
          fileInputRef.current.value = ''
        }
      }
    },
    [t]
  )

  return (
    <MainLayout
      title={title}
      className='h-full max-h-dvh'
      leftTitleButton={
        <Button
          variant='ghost'
          size='icon-sm'
          onClick={() => {
            setSidebarOpen(true)
          }}
        >
          <ListIcon className='size-5' />
        </Button>
      }
      rightTitleButton={
        <Button variant='ghost' size='icon-sm' onClick={handleNewChat}>
          <PlusIcon className='size-5' />
        </Button>
      }
    >
      <ChatProvider status={status} chats={chats}>
        <div className='-mt-4 flex h-full flex-col'>
          <div
            ref={scrollRef}
            className='-mx-4 flex h-full flex-col space-y-4 overflow-y-scroll px-4'
            style={{ scrollbarGutter: 'stable both-edges' }}
          >
            {messages.length === 0 && (
              <ChatWelcome
                onSelectPrompt={(prompt) => {
                  void sendMessage({ text: prompt })
                  persistChatUrl()
                }}
              />
            )}

            {messages.length > 0 && (
              <div ref={contentRef} className='space-y-4 pb-10 sm:pb-20'>
                {messages.map((message) =>
                  message.parts.map((part, partIdx) => (
                    <Response key={`${message.id}-${partIdx}`} part={part} role={message.role} />
                  ))
                )}
                {isSubmitted && <div className='size-6 shrink-0 animate-pulse rounded-full bg-primary' />}
              </div>
            )}
          </div>

          <form onSubmit={handleSubmit} className='mt-auto bg-background py-4'>
            {(uploadedFiles.length > 0 || uploading) && (
              <div className='mb-2 flex gap-2'>
                {uploadedFiles.map((file, idx) => (
                  <div key={idx} className='relative'>
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={file.url}
                      alt={file.filename ?? 'Attachment'}
                      className='size-16 rounded-lg object-cover'
                    />
                    <button
                      type='button'
                      className='absolute -top-1.5 -right-1.5 flex size-5 items-center justify-center rounded-full bg-destructive text-white'
                      onClick={() => {
                        handleRemoveFile(idx)
                      }}
                    >
                      <XIcon className='size-3' />
                    </button>
                  </div>
                ))}
                {uploading && (
                  <div className='flex size-16 items-center justify-center rounded-lg bg-muted'>
                    <SpinnerGapIcon className='size-5 animate-spin text-muted-foreground' />
                  </div>
                )}
              </div>
            )}
            <input ref={fileInputRef} type='file' accept='image/*' className='hidden' onChange={handleFileChange} />
            <InputGroup>
              <InputGroupInput
                value={input}
                onChange={(event) => {
                  setInput(event.currentTarget.value)
                }}
                placeholder={t('chat.input-placeholder')}
                disabled={isLoading}
              />
              <InputGroupAddon align='block-end'>
                <InputGroupButton
                  onClick={() => {
                    fileInputRef.current?.click()
                  }}
                  disabled={isLoading}
                >
                  <CameraIcon className='size-4' />
                </InputGroupButton>
                <InputGroupButton
                  type='submit'
                  disabled={isLoading || uploading || (!input.trim() && uploadedFiles.length === 0)}
                  variant='default'
                  className='ml-auto'
                  size='icon-sm'
                >
                  <ArrowUpIcon className='size-4' />
                </InputGroupButton>
              </InputGroupAddon>
            </InputGroup>
          </form>
          <div className='h-2.5 w-full shrink-0' />
        </div>

        {!isAtBottom && (
          <button
            type='button'
            className='fixed bottom-50 left-1/2 flex size-8 -translate-x-1/2 items-center justify-center rounded-full border bg-accent'
            onClick={() => {
              // eslint-disable-next-line sonarjs/void-use
              void scrollToBottom()
            }}
          >
            <ArrowDownIcon />
          </button>
        )}
        <ChatSidebar open={sidebarOpen} onOpenChange={setSidebarOpen} onNewChat={handleNewChat} />
      </ChatProvider>
    </MainLayout>
  )
}
