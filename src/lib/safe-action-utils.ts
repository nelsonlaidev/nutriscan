import type { useAction } from 'next-safe-action/hooks'

import { toast } from 'sonner'

export const VALIDATION_ERROR_MESSAGE = 'An error occurred during validation your input.'
export const SERVER_ERROR_MESSAGE = 'Something went wrong. Please try again later.'

type OnErrorArgs = Parameters<NonNullable<NonNullable<Parameters<typeof useAction>[1]>['onError']>>[0]

export function onActionError(args: OnErrorArgs) {
  const { error } = args

  if (error.validationErrors) {
    toast.error(VALIDATION_ERROR_MESSAGE)
    return
  }

  if (error.serverError && typeof error.serverError === 'string') {
    toast.error(error.serverError)
    return
  }

  toast.error(SERVER_ERROR_MESSAGE)
}
