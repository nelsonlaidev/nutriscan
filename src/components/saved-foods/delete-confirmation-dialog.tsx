import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'

export type DeleteConfirmationDialogProps = {
  open: boolean
  onOpenChange: (open: boolean) => void
  onConfirm: () => void
  isDeleting: boolean
  title: string
  description: string
  cancelText: string
  confirmText: string
  deletingText: string
}

export function DeleteConfirmationDialog({
  open: isOpen,
  onOpenChange,
  onConfirm,
  isDeleting,
  title,
  description,
  cancelText,
  confirmText,
  deletingText,
}: DeleteConfirmationDialogProps) {
  return (
    <Dialog
      open={isOpen}
      onOpenChange={(open) => {
        if (isDeleting) return
        if (!open) {
          onOpenChange(false)
        }
      }}
    >
      <DialogContent showCloseButton={false}>
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
          <DialogDescription>{description}</DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <Button
            variant='outline'
            onClick={() => {
              onOpenChange(false)
            }}
            disabled={isDeleting}
          >
            {cancelText}
          </Button>
          <Button
            variant='destructive'
            onClick={onConfirm}
            disabled={isDeleting}
            data-testid='confirm-delete-saved-food'
          >
            {isDeleting ? deletingText : confirmText}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
