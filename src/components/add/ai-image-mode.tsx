import type { NutritionData } from './nutrition-result'

import { CameraIcon, ImageIcon, SpinnerGapIcon } from '@phosphor-icons/react/ssr'
import imageCompression from 'browser-image-compression'
import Image from 'next/image'
import { useAction } from 'next-safe-action/hooks'
import { useCallback, useRef, useState } from 'react'
import { isMobile } from 'react-device-detect'
import { toast } from 'sonner'

import { scanFoodImage } from '@/actions/ai-image-scan'
import { Button } from '@/components/ui/button'

type AiImageModeProps = {
  onResult: (data: NutritionData) => void
}

export function AiImageMode(props: AiImageModeProps) {
  const { onResult } = props
  const [preview, setPreview] = useState<string | null>(null)
  const cameraInputRef = useRef<HTMLInputElement>(null)
  const uploadInputRef = useRef<HTMLInputElement>(null)

  const { execute, isPending } = useAction(scanFoodImage, {
    onSuccess: ({ data }) => {
      if (data.success) {
        onResult(data.data)
      } else {
        toast.error(data.error)
      }
    },
    onError: () => {
      toast.error('Failed to analyze image')
    }
  })

  const handleFileSelected = useCallback(
    async (file: File) => {
      const compressed = await imageCompression(file, {
        maxSizeMB: 1,
        maxWidthOrHeight: 1024,
        useWebWorker: true
      })

      const reader = new FileReader()
      reader.addEventListener('load', () => {
        const base64 = reader.result as string
        setPreview(base64)
        execute({ imageBase64: base64 })
      })
      reader.readAsDataURL(compressed)
    },
    [execute]
  )

  const handleInputChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0]
      if (file) {
        void handleFileSelected(file)
      }
      e.target.value = ''
    },
    [handleFileSelected]
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
          <Image src={preview} alt='Food preview' fill className='object-cover' />
        ) : (
          <div className='flex flex-col items-center gap-2 text-muted-foreground'>
            <CameraIcon size={40} />
            <span className='text-sm'>Take or upload a photo of food</span>
          </div>
        )}

        {isPending && (
          <div className='absolute inset-0 flex flex-col items-center justify-center gap-2 bg-black/40'>
            <SpinnerGapIcon size={40} className='animate-spin text-white' />
            <span className='text-sm font-medium text-white'>Analyzing image...</span>
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
              toast.info('Camera is only available on mobile devices. Please upload an image instead.')
            }
          }}
          disabled={isPending}
        >
          <CameraIcon size={16} />
          Take Photo
        </Button>
        <Button
          variant='outline'
          className='flex-1'
          onClick={() => uploadInputRef.current?.click()}
          disabled={isPending}
        >
          <ImageIcon size={16} />
          Upload Photo
        </Button>
      </div>
    </div>
  )
}
