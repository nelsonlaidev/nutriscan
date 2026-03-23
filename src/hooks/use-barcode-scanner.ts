'use client'

import type { NutritionData } from '@/components/add/nutrition-result'

import { useCallback, useRef, useState } from 'react'

import { useBarcodeLookup } from '@/hooks/queries/scanning.query'

type ScannerState =
  | { status: 'idle' }
  | { status: 'scanning' }
  | { status: 'looking-up' }
  | { status: 'error'; message: string }

export function useBarcodeScanner(onResult: (data: NutritionData) => void) {
  const [state, setState] = useState<ScannerState>({ status: 'idle' })
  const lastBarcodeRef = useRef<string | null>(null)
  const active = state.status === 'scanning' || state.status === 'looking-up'

  const { mutate: lookupBarcode } = useBarcodeLookup((data) => {
    setState({ status: 'idle' })
    lastBarcodeRef.current = null
    onResult(data)
  })

  const handleMutationError = useCallback(() => {
    setState({ status: 'error', message: 'Failed to look up product' })
    setTimeout(() => {
      lastBarcodeRef.current = null
      setState({ status: 'scanning' })
    }, 3000)
  }, [])

  const handleScan = useCallback(
    (detectedCodes: Array<{ rawValue: string }>) => {
      const barcode = detectedCodes[0]?.rawValue
      if (!barcode || barcode === lastBarcodeRef.current) return

      lastBarcodeRef.current = barcode
      setState({ status: 'looking-up' })
      lookupBarcode({ barcode }, { onError: handleMutationError })
    },
    [lookupBarcode, handleMutationError],
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
      lookupBarcode({ barcode }, { onError: handleMutationError })
    },
    [lookupBarcode, handleMutationError],
  )

  return { state, startScanning, stopScanning, active, handleScan, handleError, lookupManualBarcode }
}
