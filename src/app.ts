import './libs/utils/NodeProcessHandler' // catch unhandled error
// packages import
import express from 'express'
import helmet from 'helmet'
import rateLimit from 'express-rate-limit'
import hpp from 'hpp'

// local import
import ValidatedEnv from './libs/utils/ValidatedEnv'
import gracefulShutdown from './libs/utils/gracefulShutdown'
import logger from './libs/utils/logger'
import errorMiddleware from './middlewares/error.mw'
import notFound from './middlewares/notFound.mw'
import route from './routes'

const app = express()

// middlewares
app.use(helmet())
app.use(express.json({ limit: '16kb' }))
app.use(hpp()) // parameter pollution prevent
app.use(
  rateLimit({
    max: 5,
    windowMs: 1000, // 1s
    message: 'Too many request!',
  })
)

//------- route for the app-------
app.use('/api/v1', route)

// catch all route (404 not found)
app.all('*', notFound)

// global error handler
app.use(errorMiddleware)

const bootstrap = async (port: number): Promise<void> => {
  app.on('error', () => {
    logger.error(`[app error] - error starting the app`)
    process.exit(0)
  })

  const server = app.listen(port, () => {
    const logString = `[ Startup ] App is listening on http://localhost:${port} - With Node Process ID is ${process.pid}`
    logger.info(logString)
    if (ValidatedEnv.nodeEnv === 'production') console.info(logString)
  })

  gracefulShutdown(server)
}

export default bootstrap
