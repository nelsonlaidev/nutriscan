'use client'

import { TrashIcon } from '@phosphor-icons/react/ssr'
import { useRouter } from 'next/navigation'
import { useTranslations } from 'next-intl'
import { useState } from 'react'
import { toast } from 'sonner'

import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import { useDeleteFoodEntry } from '@/hooks/queries/food.query'

type DeleteFoodEntryButtonProps = {
  entryId: string
  category: string
}

export function DeleteFoodEntryButton({ entryId, category }: DeleteFoodEntryButtonProps) {
  const t = useTranslations()
  const router = useRouter()
  const [open, setOpen] = useState(false)

  const { mutate, isPending } = useDeleteFoodEntry(() => {
    toast.success(t('meals.entry-deleted'))
    router.push(`/meals/${category}`)
  })

  function handleDelete() {
    if (isPending) return

    mutate(
      { id: entryId },
      {
        onError: () => {
          toast.error(t('meals.entry-delete-error'))
        },
      },
    )
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger render={<Button variant='destructive' size='lg' className='w-full' />}>
        <TrashIcon size={18} />
        {t('meals.delete')}
      </DialogTrigger>
      <DialogContent showCloseButton={false}>
        <DialogHeader>
          <DialogTitle>{t('meals.delete-title')}</DialogTitle>
          <DialogDescription>{t('meals.delete-description')}</DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <Button
            variant='outline'
            onClick={() => {
              setOpen(false)
            }}
            disabled={isPending}
          >
            {t('meals.delete-cancel')}
          </Button>
          <Button variant='destructive' onClick={handleDelete} disabled={isPending}>
            {isPending ? t('meals.deleting') : t('meals.delete-confirm')}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
