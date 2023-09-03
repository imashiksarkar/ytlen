import express from "express"
import dotenv from "dotenv"
import helmet from "helmet"

// init dotenv
dotenv.config()

// local imports
import "./utils/nodeProcessHandler" // catch unhandled error
import gracefulShutdown from "./utils/gracefulShutdown"
import route from "./route"
import errorMiddleware from "./middlewares/error.mw"
import notFound from "./middlewares/notFound.mw"
import health from "./middlewares/health.mw"

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
  const server = app.listen(port, startLog(port))

  gracefulShutdown(server)
}

export default bootstrap
