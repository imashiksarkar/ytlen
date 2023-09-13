import "./utils/nodeProcessHandler" // catch unhandled error
import "./utils/validatedEnv" // validate env

// packages import
import express from "express"
import helmet from "helmet"

// local import
import errorMiddleware from "./middlewares/error.mw"
import health from "./middlewares/health.mw"
import notFound from "./middlewares/notFound.mw"
import route from "./route"
import gracefulShutdown from "./utils/gracefulShutdown"

const app = express()

// middlewares
app.use(helmet())
app.use(express.json())

// route for the app
app.use("/api/v1", route)

// health check route
app.use("/api/v1/health", health)

// 404 not found route (Catch All Route)
app.all("*", notFound)

// universal error handler
app.use(errorMiddleware)

const startLog = (port: number) => () => {
  console.log(
    `App is listening on http://localhost:${port}\nNode Process ID is ${process.pid}`
  )
}

const bootstrap = (port: number): void => {
  console.log("boot", port)

  const server = app.listen(port, startLog(port))

  gracefulShutdown(server)
}

export default bootstrap
