import "./utils/nodeProcessHandler" // catch unhandled error
import "./utils/validatedEnv" // validate env
// packages import
import express from "express"
import helmet from "helmet"

// local import
import errorMiddleware from "./middlewares/error.mw"
import route from "./routes"
import gracefulShutdown from "./utils/gracefulShutdown"
import logger from "./utils/logger"
import env from "./utils/validatedEnv"

const app = express()

// middlewares
app.use(helmet())
app.use(express.json())

// route for the app
app.use("/api/v1", route)

// universal error handler
app.use(errorMiddleware)

const bootstrap = async (port: number): Promise<void> => {
  const server = app.listen(port, () => {
    const logString = `[ Startup ] App is listening on http://localhost:${port} - With Node Process ID is ${process.pid}`
    logger.info(logString)
    if (env.nodeEnv === "production") console.info(logString)
  })

  gracefulShutdown(server)
}

export default bootstrap
