import pino from 'pino'

const isDev = process.env.NODE_ENV === 'development'

export const logger = pino({
  level: isDev ? 'debug' : 'silent',
  ...(isDev && {
    transport: {
      target: 'pino-pretty',
      options: {
        colorize: true
      }
    }
  })
})
