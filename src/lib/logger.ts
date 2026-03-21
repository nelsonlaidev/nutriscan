import pino from 'pino'

import { isDev } from './constants'

export const logger = pino({
  level: isDev ? 'debug' : 'silent',
  ...(isDev && {
    transport: {
      target: 'pino-pretty',
      options: {
        colorize: true,
      },
    },
  }),
})
