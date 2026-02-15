'use client'

import { CheckCircleIcon, InfoIcon, SpinnerIcon, WarningIcon, XCircleIcon } from '@phosphor-icons/react/ssr'
import { useTheme } from 'next-themes'
import { Toaster as Sonner, type ToasterProps } from 'sonner'

type ToasterPropsType = ToasterProps

function Toaster(props: ToasterPropsType) {
  const { theme = 'system' } = useTheme()

  return (
    <Sonner
      theme={theme as ToasterPropsType['theme']}
      className='toaster group'
      icons={{
        success: <CheckCircleIcon size={16} />,
        info: <InfoIcon size={16} />,
        warning: <WarningIcon size={16} />,
        error: <XCircleIcon size={16} />,
        loading: <SpinnerIcon size={16} className='animate-spin' />
      }}
      style={
        {
          '--normal-bg': 'var(--popover)',
          '--normal-text': 'var(--popover-foreground)',
          '--normal-border': 'var(--border)',
          '--border-radius': 'var(--radius)'
        } as React.CSSProperties
      }
      toastOptions={{
        classNames: {
          toast: 'cn-toast'
        }
      }}
      {...props}
    />
  )
}

export { Toaster }
