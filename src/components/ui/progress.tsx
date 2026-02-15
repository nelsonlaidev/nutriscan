'use client'

import { Progress as ProgressPrimitive } from '@base-ui/react/progress'

import { cn } from '@/lib/utils'

type ProgressProps = ProgressPrimitive.Root.Props

function Progress(props: ProgressProps) {
  const { className, children, value, ...rest } = props

  return (
    <ProgressPrimitive.Root
      value={value}
      data-slot='progress'
      className={cn('flex flex-wrap gap-3', className)}
      {...rest}
    >
      {children}
      <ProgressTrack>
        <ProgressIndicator />
      </ProgressTrack>
    </ProgressPrimitive.Root>
  )
}

type ProgressTrackProps = ProgressPrimitive.Track.Props

function ProgressTrack(props: ProgressTrackProps) {
  const { className, ...rest } = props

  return (
    <ProgressPrimitive.Track
      className={cn('relative flex h-2 w-full items-center overflow-x-hidden rounded-4xl bg-muted', className)}
      data-slot='progress-track'
      {...rest}
    />
  )
}

type ProgressIndicatorProps = ProgressPrimitive.Indicator.Props

function ProgressIndicator(props: ProgressIndicatorProps) {
  const { className, ...rest } = props

  return (
    <ProgressPrimitive.Indicator
      data-slot='progress-indicator'
      className={cn('h-full bg-primary transition-all', className)}
      {...rest}
    />
  )
}

type ProgressLabelProps = ProgressPrimitive.Label.Props

function ProgressLabel(props: ProgressLabelProps) {
  const { className, ...rest } = props

  return (
    <ProgressPrimitive.Label className={cn('text-sm font-medium', className)} data-slot='progress-label' {...rest} />
  )
}

type ProgressValueProps = ProgressPrimitive.Value.Props

function ProgressValue(props: ProgressValueProps) {
  const { className, ...rest } = props

  return (
    <ProgressPrimitive.Value
      className={cn('ml-auto text-sm text-muted-foreground tabular-nums', className)}
      data-slot='progress-value'
      {...rest}
    />
  )
}

export { Progress, ProgressIndicator, ProgressLabel, ProgressTrack, ProgressValue }
