import type { UIMessage } from 'ai'

import { createOpenRouter } from '@openrouter/ai-sdk-provider'
import { generateText } from 'ai'

import { env } from '@/env'
import { titlePrompt } from '@/lib/prompts'
import { getTextFromMessage } from '@/lib/utils'

const openrouter = createOpenRouter({
  apiKey: env.OPENROUTER_API_KEY
})

export const defaultModel = openrouter('google/gemini-3-flash-preview')

const titleModel = openrouter('google/gemini-2.5-flash-lite')

export async function generateTitle(message: UIMessage) {
  const { text } = await generateText({
    model: titleModel,
    system: titlePrompt,
    prompt: getTextFromMessage(message)
  })
  return (
    text
      .replace(/^[#*"\s]+/, '')
      // eslint-disable-next-line sonarjs/slow-regex
      .replace(/"+$/, '')
      .trim()
  )
}
