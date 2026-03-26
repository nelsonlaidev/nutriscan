'use client'

import { QueryClientProvider } from '@tanstack/react-query'
// import { ReactQueryDevtools } from '@tanstack/react-query-devtools'
import { Provider as JotaiProvider } from 'jotai'
import { ThemeProvider } from 'next-themes'
import { NuqsAdapter } from 'nuqs/adapters/next/app'
import { useState } from 'react'

import { createQueryClient } from '@/lib/query/client'

import { TooltipProvider } from './ui/tooltip'

type ProvidersProps = {
  children: React.ReactNode
}

export function Providers(props: ProvidersProps) {
  const { children } = props
  const [queryClient] = useState(() => createQueryClient())

  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <ThemeProvider attribute='class' disableTransitionOnChange>
          <JotaiProvider>
            <NuqsAdapter>{children}</NuqsAdapter>
          </JotaiProvider>
        </ThemeProvider>
      </TooltipProvider>
      {/* <ReactQueryDevtools /> */}
    </QueryClientProvider>
  )
}
