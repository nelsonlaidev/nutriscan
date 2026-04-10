'use client'

import { DownloadSimpleIcon, SpinnerGapIcon } from '@phosphor-icons/react/ssr'
import { useTranslations } from 'next-intl'
import { useState } from 'react'
import { toast } from 'sonner'

import { Button } from '@/components/ui/button'
import { createProfileShareFilename } from '@/lib/profile/share'

type ProfileShareButtonProps = {
  name: string
}

function downloadFile(file: File) {
  const objectUrl = URL.createObjectURL(file)
  const anchor = document.createElement('a')

  anchor.href = objectUrl
  anchor.download = file.name
  anchor.click()

  globalThis.setTimeout(() => {
    URL.revokeObjectURL(objectUrl)
  }, 1000)
}

export function ProfileShareButton({ name }: ProfileShareButtonProps) {
  const t = useTranslations()
  const [isPending, setIsPending] = useState(false)

  async function generateShareFile() {
    const response = await fetch('/profile/share-image', {
      cache: 'no-store',
    })

    if (!response.ok) {
      throw new Error('share-image-request-failed')
    }

    const blob = await response.blob()

    return new File([blob], createProfileShareFilename(name), {
      type: blob.type || 'image/png',
    })
  }

  async function handleDownload() {
    setIsPending(true)

    try {
      const file = await generateShareFile()
      downloadFile(file)
      toast.success(t('profile.share.download-success'))
    } catch {
      toast.error(t('profile.share.error'))
    } finally {
      setIsPending(false)
    }
  }

  return (
    <Button type='button' variant='outline' onClick={handleDownload} disabled={isPending} className='w-full sm:w-auto'>
      {isPending ? <SpinnerGapIcon className='animate-spin' /> : <DownloadSimpleIcon />}
      {isPending ? t('profile.share.generating') : t('profile.share.button')}
    </Button>
  )
}
