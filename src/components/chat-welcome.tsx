import { BowlFoodIcon, CarrotIcon, HeartbeatIcon } from '@phosphor-icons/react/ssr'
import { useTranslations } from 'next-intl'

type ChatWelcomeProps = {
  onSelectPrompt: (prompt: string) => void
}

const PROMPTS = [
  { icon: CarrotIcon, key: 'chat.prompt-breakfast' },
  { icon: BowlFoodIcon, key: 'chat.prompt-meal-plan' },
  { icon: HeartbeatIcon, key: 'chat.prompt-water' }
] as const

export function ChatWelcome(props: ChatWelcomeProps) {
  const { onSelectPrompt } = props
  const t = useTranslations()

  return (
    <div className='flex flex-1 flex-col items-center justify-center'>
      <div className='mb-2 text-4xl'>🥗</div>
      <h2 className='mb-1 text-xl font-semibold'>{t('chat.welcome-title')}</h2>
      <p className='mb-8 text-sm text-muted-foreground'>{t('chat.welcome-subtitle')}</p>
      <div className='flex w-full flex-col gap-2'>
        {PROMPTS.map(({ icon: Icon, key }) => {
          const text = t(key)
          return (
            <button
              key={key}
              type='button'
              className='flex items-center gap-3 rounded-2xl border bg-card px-4 py-3 text-left text-sm transition-colors hover:bg-accent'
              onClick={() => {
                onSelectPrompt(text)
              }}
            >
              <Icon className='size-5 shrink-0 text-primary' />
              {text}
            </button>
          )
        })}
      </div>
    </div>
  )
}
