import type { UIMessage } from 'ai'
import type { StreamdownProps } from 'streamdown'

import { cjk } from '@streamdown/cjk'
import { code } from '@streamdown/code'
import { math } from '@streamdown/math'
import { mermaid } from '@streamdown/mermaid'
import { Streamdown } from 'streamdown'

import { cn } from '@/lib/utils'

type MessageProps = StreamdownProps & {
  role: UIMessage['role']
}

export function Message(props: MessageProps) {
  const { plugins, mermaid: mermaidConfig, role, ...rest } = props
  const isUser = role === 'user'

  return (
    <div className={cn('flex', isUser ? 'justify-end' : 'justify-start')}>
      <Streamdown
        animated
        plugins={{
          code: code,
          mermaid: mermaid,
          math: math,
          cjk: cjk,
          ...plugins,
        }}
        shikiTheme={['github-light-default', 'github-dark-default']}
        mermaid={{ config: { theme: 'neutral', ...mermaidConfig?.config }, ...mermaidConfig }}
        className={cn('rounded-4xl px-4 py-3', isUser ? 'bg-primary text-primary-foreground' : 'bg-accent')}
        {...rest}
      />
    </div>
  )
}
