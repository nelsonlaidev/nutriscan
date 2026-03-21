'use client'

import { useTranslations } from 'next-intl'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { cn } from '@/lib/utils'

type BmiCardProps = {
  weight: number
  height: number
}

function computeBmi(weightKg: number, heightCm: number) {
  const heightM = heightCm / 100
  return weightKg / (heightM * heightM)
}

type BmiCategory = 'underweight' | 'normal' | 'overweight' | 'obese'

function getBmiCategory(bmi: number): BmiCategory {
  if (bmi < 18.5) return 'underweight'
  if (bmi < 25) return 'normal'
  if (bmi < 30) return 'overweight'
  return 'obese'
}

const categoryColors: Record<BmiCategory, { stroke: string; text: string }> = {
  underweight: { stroke: '#3b82f6', text: 'text-blue-600' },
  normal: { stroke: '#22c55e', text: 'text-green-600' },
  overweight: { stroke: '#f59e0b', text: 'text-amber-600' },
  obese: { stroke: '#ef4444', text: 'text-red-600' },
}

function BmiGauge({ bmi }: { bmi: number }) {
  const clampedBmi = Math.min(40, Math.max(10, bmi))
  // Map BMI 10–40 to angle 0–180
  const angle = ((clampedBmi - 10) / 30) * 180
  const rad = ((180 - angle) * Math.PI) / 180
  const cx = 100
  const cy = 90
  const r = 70

  // Needle endpoint
  const nx = round(cx + r * Math.cos(rad))
  const ny = round(cy - r * Math.sin(rad))

  return (
    <svg viewBox='0 0 200 110' className='mx-auto w-full max-w-52'>
      <path d={arcPath(cx, cy, r, 0, 55.8)} fill='none' stroke='#3b82f6' strokeWidth={10} strokeLinecap='round' />
      <path d={arcPath(cx, cy, r, 57, 96.6)} fill='none' stroke='#22c55e' strokeWidth={10} strokeLinecap='round' />
      <path d={arcPath(cx, cy, r, 98, 120)} fill='none' stroke='#f59e0b' strokeWidth={10} strokeLinecap='round' />
      <path d={arcPath(cx, cy, r, 121.2, 180)} fill='none' stroke='#ef4444' strokeWidth={10} strokeLinecap='round' />
      <line x1={cx} y1={cy} x2={nx} y2={ny} stroke='#1f2937' strokeWidth={2.5} strokeLinecap='round' />
      <circle cx={cx} cy={cy} r={4} fill='#1f2937' />
    </svg>
  )
}

function arcPath(cx: number, cy: number, r: number, startAngle: number, endAngle: number) {
  const start = polarToCartesian(cx, cy, r, endAngle)
  const end = polarToCartesian(cx, cy, r, startAngle)
  const largeArc = endAngle - startAngle > 180 ? 1 : 0
  return `M ${start.x} ${start.y} A ${r} ${r} 0 ${largeArc} 0 ${end.x} ${end.y}`
}

function round(n: number) {
  return Math.round(n * 100) / 100
}

function polarToCartesian(cx: number, cy: number, r: number, angleDeg: number) {
  const rad = ((180 - angleDeg) * Math.PI) / 180
  return { x: round(cx + r * Math.cos(rad)), y: round(cy - r * Math.sin(rad)) }
}

export function BmiCard({ weight, height }: BmiCardProps) {
  const t = useTranslations()
  const bmi = computeBmi(weight, height)
  const category = getBmiCategory(bmi)
  const colors = categoryColors[category]

  return (
    <Card size='sm'>
      <CardHeader>
        <CardTitle>{t('progress.bmi')}</CardTitle>
      </CardHeader>
      <CardContent>
        <BmiGauge bmi={bmi} />
        <div className='mt-2 text-center'>
          <span className='text-3xl font-semibold'>{bmi.toFixed(1)}</span>
          <span className={cn('ml-2 text-sm font-medium', colors.text)}>{t(`progress.${category}`)}</span>
        </div>
      </CardContent>
    </Card>
  )
}
