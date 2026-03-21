'use client'

import type { NutritionData } from '@/components/add/nutrition-result'

import { useAction } from 'next-safe-action/hooks'
import { useCallback, useRef, useState } from 'react'

import { lookupBarcode } from '@/actions/barcode-lookup'
import { onActionError } from '@/lib/safe-action-utils'

type ScannerState =
  | { status: 'idle' }
  | { status: 'scanning' }
  | { status: 'looking-up' }
  | { status: 'error'; message: string }

export function useBarcodeScanner(onResult: (data: NutritionData) => void) {
  const [state, setState] = useState<ScannerState>({ status: 'idle' })
  const lastBarcodeRef = useRef<string | null>(null)
  const active = state.status === 'scanning' || state.status === 'looking-up'

  const { execute } = useAction(lookupBarcode, {
    onSuccess: ({ data }) => {
      if (data.success) {
        setState({ status: 'idle' })
        lastBarcodeRef.current = null
        onResult(data.data)
      } else {
        setState({ status: 'error', message: 'Product not found in database' })
        setTimeout(() => {
          lastBarcodeRef.current = null
          setState({ status: 'scanning' })
        }, 3000)
      }
    },
    onError: (args) => {
      onActionError(args)
      setState({ status: 'error', message: 'Failed to look up product' })
      setTimeout(() => {
        lastBarcodeRef.current = null
        setState({ status: 'scanning' })
      }, 3000)
    },
  })

  const handleScan = useCallback(
    (detectedCodes: Array<{ rawValue: string }>) => {
      const barcode = detectedCodes[0]?.rawValue
      if (!barcode || barcode === lastBarcodeRef.current) return

      lastBarcodeRef.current = barcode
      setState({ status: 'looking-up' })
      execute({ barcode })
    },
    [execute],
  )

  const handleError = useCallback((error: unknown) => {
    if (error instanceof DOMException && error.name === 'NotAllowedError') {
      setState({ status: 'error', message: 'Camera permission denied' })
    }
  }, [])

  const startScanning = useCallback(() => {
    lastBarcodeRef.current = null
    setState({ status: 'scanning' })
  }, [])

  const stopScanning = useCallback(() => {
    lastBarcodeRef.current = null
    setState({ status: 'idle' })
  }, [])

  const lookupManualBarcode = useCallback(
    (barcode: string) => {
      setState({ status: 'looking-up' })
      execute({ barcode })
    },
    [execute],
  )

  return { state, startScanning, stopScanning, active, handleScan, handleError, lookupManualBarcode }
}
