'use client'

import 'katex/dist/katex.min.css'

import type { FileUIPart } from 'ai'

import { useChat } from '@ai-sdk/react'
import { eventIteratorToUnproxiedDataStream } from '@orpc/client'
import {
  ArrowDownIcon,
  ArrowUpIcon,
  CameraIcon,
  ListIcon,
  PlusIcon,
  SpinnerGapIcon,
  XIcon,
} from '@phosphor-icons/react/ssr'
import { useQueryClient } from '@tanstack/react-query'
import { useRouter } from 'next/navigation'
import { useTranslations } from 'next-intl'
import { useCallback, useRef, useState } from 'react'
import { toast } from 'sonner'
import { useStickToBottom } from 'use-stick-to-bottom'

import { ChatProvider } from '@/contexts/chat'
import { useChatById } from '@/hooks/queries/chat.query'
import { useUploadImage } from '@/hooks/queries/r2.query'
import { blobToBase64 } from '@/lib/blob'
import { client, orpc } from '@/orpc/client'

import { ChatSidebar } from './chat-sidebar'
import { ChatWelcome } from './chat-welcome'
import { MainLayout } from './main-layout'
import { Response } from './response'
import { Button } from './ui/button'
import { InputGroup, InputGroupAddon, InputGroupButton, InputGroupInput } from './ui/input-group'

type ChatProps = {
  id: string
}

export function Chat(props: ChatProps) {
  const { id } = props

  const { data: chatData } = useChatById({ chatId: id })

  const t = useTranslations()
  const [input, setInput] = useState('')
  const [uploadedFiles, setUploadedFiles] = useState<FileUIPart[]>([])
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const router = useRouter()
  const { contentRef, scrollRef, scrollToBottom, isAtBottom } = useStickToBottom({ resize: 'smooth' })
  const queryClient = useQueryClient()
  const { mutateAsync: uploadImage, isPending: uploading } = useUploadImage()

  const initialMessages = chatData?.messages.map((m) => ({
    id: m.id,
    role: m.role,
    parts: m.parts,
  }))

  const { messages, sendMessage, status } = useChat({
    id,
    messages: initialMessages,
    transport: {
      sendMessages: async (options) =>
        eventIteratorToUnproxiedDataStream(
          await client.chat.send(
            {
              chatId: options.chatId,
              // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
              message: options.messages.at(-1)!,
            },
            { signal: options.abortSignal },
          ),
        ),
      reconnectToStream: () => {
        throw new Error('Unsupported')
      },
    },
    onFinish: () => {
      void queryClient.invalidateQueries({ queryKey: orpc.chat.getById.key({ input: { chatId: id } }) })
      void queryClient.invalidateQueries({ queryKey: orpc.chat.list.key() })
    },
  })

  const isStreaming = status === 'streaming'
  const isSubmitted = status === 'submitted'
  const isLoading = isSubmitted || isStreaming

  const lastMessage = messages.at(-1)
  const hasContent = lastMessage?.parts.some(
    (part) =>
      (part.type === 'text' && part.text.trim().length > 0) ||
      (part.type === 'reasoning' && 'text' in part && part.text.trim().length > 0) ||
      part.type.startsWith('tool-'),
  )

  const isThinking = isLoading && lastMessage?.role === 'assistant' && !hasContent

  const handleNewChat = useCallback(() => {
    setSidebarOpen(false)
    router.push('/chat')
  }, [router])

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

      // eslint-disable-next-line sonarjs/void-use
      void scrollToBottom()

      void sendMessage({
        text: input,
        files: uploadedFiles.length > 0 ? uploadedFiles : undefined,
      })

      setInput('')
      setUploadedFiles([])
      if (fileInputRef.current) {
        fileInputRef.current.value = ''
      }
    },
    [input, scrollToBottom, sendMessage, status, t, uploadedFiles],
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

      try {
        const base64 = await blobToBase64(file)

        const { url } = await uploadImage({
          base64,
          mimeType: file.type as 'image/jpeg' | 'image/png' | 'image/webp' | 'image/gif',
          type: 'chat',
        })
        setUploadedFiles((prev) => [
          ...prev,
          {
            type: 'file' as const,
            filename: file.name,
            mediaType: file.type,
            url,
          },
        ])
      } catch {
        toast.error(t('chat.upload-failed'))
      } finally {
        if (fileInputRef.current) {
          fileInputRef.current.value = ''
        }
      }
    },
    [t, uploadImage],
  )

  return (
    <MainLayout
      title={chatData?.title ?? t('nav.chat')}
      className='h-full max-h-dvh'
      leftTitleButton={
        <Button
          variant='ghost'
          size='icon-sm'
          onClick={() => {
            setSidebarOpen(true)
          }}
          data-testid='open-chat-history'
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
      <ChatProvider status={status}>
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
                }}
              />
            )}

            {messages.length > 0 && (
              <div ref={contentRef} className='space-y-4 pb-10 sm:pb-20'>
                {messages.map((message) =>
                  message.parts.map((part, partIdx) => (
                    // eslint-disable-next-line @eslint-react/no-array-index-key
                    <Response key={`${message.id}-${partIdx}`} part={part} role={message.role} />
                  )),
                )}
                {isThinking && <div className='size-6 shrink-0 animate-pulse rounded-full bg-primary' />}
              </div>
            )}
          </div>

          <form onSubmit={handleSubmit} className='mt-auto bg-background py-4'>
            {(uploadedFiles.length > 0 || uploading) && (
              <div className='mb-2 flex gap-2'>
                {uploadedFiles.map((file, idx) => (
                  // eslint-disable-next-line @eslint-react/no-array-index-key
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
        <ChatSidebar currentChatId={id} open={sidebarOpen} onOpenChange={setSidebarOpen} onNewChat={handleNewChat} />
      </ChatProvider>
    </MainLayout>
  )
}
