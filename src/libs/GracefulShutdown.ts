import { logger } from './utils'

class GracefulShutdown {
  private readonly SIGNALS = ['SIGINT', 'SIGTERM'] as const
  callbacks: Array<(signal: (typeof this.SIGNALS)[number]) => void> = []

  constructor() {
    this.SIGNALS.forEach((signal) => {
      process.on(signal, () => {
        logger.info(`[ ${signal} ] Graceful shutdown.`)
        this.callbacks.forEach(async (callback) => await callback(signal))
        process.exit(0)
      })
    })
  }

  add = (callback: (typeof this.callbacks)[1]) => {
    this.callbacks.push(callback)
  }
}

