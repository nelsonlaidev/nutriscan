import pino from 'pino'

import { IS_DEV } from './constants'

export const logger = pino({
  level: IS_DEV ? 'debug' : 'silent',
  ...(IS_DEV && {
    transport: {
      target: 'pino-pretty',
      options: {
        colorize: true,
      },
    },
  }),
})
