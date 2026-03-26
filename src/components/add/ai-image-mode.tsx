import type { NutritionData } from './nutrition-result'

import { CameraIcon, ImageIcon } from '@phosphor-icons/react/ssr'
import imageCompression from 'browser-image-compression'
import Image from 'next/image'
import { useTranslations } from 'next-intl'
import { useCallback, useEffect, useRef, useState } from 'react'
import { isMobile } from 'react-device-detect'
import { toast } from 'sonner'

import { Button } from '@/components/ui/button'
import { useUploadImage } from '@/hooks/queries/r2.query'
import { useAiImageScan } from '@/hooks/queries/scanning.query'
import { blobToBase64 } from '@/lib/blob'

import { Spinner } from '../ui/spinner'

type AiImageModeProps = {
  onResult: (data: NutritionData) => void
}

const SUPPORTED_IMAGE_TYPES = ['image/jpeg', 'image/png', 'image/webp', 'image/gif'] as const

export function AiImageMode(props: AiImageModeProps) {
  const { onResult } = props
  const t = useTranslations()
  const [preview, setPreview] = useState<string | null>(null)
  const previewRef = useRef<string | null>(null)
  const cameraInputRef = useRef<HTMLInputElement>(null)
  const uploadInputRef = useRef<HTMLInputElement>(null)

  const { mutate: scanImage, isPending } = useAiImageScan((data) => {
    onResult(data)
  })

  const { mutateAsync: uploadImage, isPending: isUploading } = useUploadImage()

  useEffect(
    () => () => {
      if (previewRef.current) URL.revokeObjectURL(previewRef.current)
    },
    [],
  )

  const isProcessing = isUploading || isPending

  const handleFileSelected = useCallback(
    async (file: File) => {
      if (!SUPPORTED_IMAGE_TYPES.includes(file.type as (typeof SUPPORTED_IMAGE_TYPES)[number])) {
        toast.error(t('add-food.unsupported-image-format'))
        return
      }

      const compressed = await imageCompression(file, {
        maxSizeMB: 1,
        maxWidthOrHeight: 1024,
        useWebWorker: true,
      })

      if (previewRef.current) URL.revokeObjectURL(previewRef.current)
      const previewUrl = URL.createObjectURL(compressed)
      previewRef.current = previewUrl
      setPreview(previewUrl)

      try {
        const base64 = await blobToBase64(compressed)

        const { url: imageUrl } = await uploadImage({
          base64,
          mimeType: compressed.type as 'image/jpeg' | 'image/png' | 'image/webp' | 'image/gif',
          type: 'meal',
        })
        scanImage(
          { imageUrl },
          {
            onError: (error) => {
              if (error.message === 'errors.no-food-detected') {
                toast.error(t(error.message))
              } else {
                toast.error(t('errors.ai-scan-failed'))
              }
              setPreview(null)
            },
          },
        )
      } catch {
        toast.error(t('errors.ai-scan-failed'))
      }
    },
    [scanImage, t, uploadImage],
  )

  const handleInputChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0]
      if (file) {
        void handleFileSelected(file)
      }
      // Resetting file input value is standard practice
      // oxlint-disable-next-line react-x/immutability
      e.target.value = ''
    },
    [handleFileSelected],
  )

  return (
    <div className='flex flex-col gap-4'>
      <input
        ref={cameraInputRef}
        type='file'
        accept='image/*'
        capture='environment'
        className='hidden'
        onChange={handleInputChange}
      />
      <input ref={uploadInputRef} type='file' accept='image/*' className='hidden' onChange={handleInputChange} />

      <div className='relative flex aspect-4/3 flex-col items-center justify-center overflow-hidden rounded-2xl border-2 border-dashed border-border bg-muted/50'>
        {preview ? (
          <Image src={preview} alt={t('add-food.food-preview')} fill className='object-cover' />
        ) : (
          <div className='flex flex-col items-center gap-2 text-muted-foreground'>
            <CameraIcon size={40} />
            <span className='text-sm'>{t('add-food.take-upload-photo')}</span>
          </div>
        )}

        {isProcessing && (
          <div className='absolute inset-0 flex flex-col items-center justify-center gap-2 bg-black/40'>
            <Spinner size={40} className='text-white' />
            <span className='text-sm font-medium text-white'>{t('add-food.analyzing-image')}</span>
          </div>
        )}
      </div>

      <div className='flex gap-3'>
        <Button
          className='flex-1'
          onClick={() => {
            if (isMobile) {
              cameraInputRef.current?.click()
            } else {
              toast.info(t('add-food.camera-unavailable'))
            }
          }}
          disabled={isProcessing}
        >
          <CameraIcon size={16} />
          {t('add-food.take-photo')}
        </Button>
        <Button
          variant='outline'
          className='flex-1'
          onClick={() => uploadInputRef.current?.click()}
          disabled={isProcessing}
        >
          <ImageIcon size={16} />
          {t('add-food.upload-photo')}
        </Button>
      </div>
    </div>
  )
}
