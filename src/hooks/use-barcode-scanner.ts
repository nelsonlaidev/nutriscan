'use client'

import type { NutritionData } from '@/components/add/nutrition-result'

import { useMutation } from '@tanstack/react-query'
import { useCallback, useRef, useState } from 'react'

import { orpc } from '@/orpc/client'

type ScannerState =
  | { status: 'idle' }
  | { status: 'scanning' }
  | { status: 'looking-up' }
  | { status: 'error'; message: string }

export function useBarcodeScanner(onResult: (data: NutritionData) => void) {
  const [state, setState] = useState<ScannerState>({ status: 'idle' })
  const lastBarcodeRef = useRef<string | null>(null)
  const active = state.status === 'scanning' || state.status === 'looking-up'

  const { mutate: execute } = useMutation(
    orpc.scanning.barcodeLookup.mutationOptions({
      onSuccess: (data) => {
        setState({ status: 'idle' })
        lastBarcodeRef.current = null
        onResult(data)
      },
      onError: () => {
        setState({ status: 'error', message: 'Failed to look up product' })
        setTimeout(() => {
          lastBarcodeRef.current = null
          setState({ status: 'scanning' })
        }, 3000)
      },
    }),
  )

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
