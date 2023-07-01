import express from "express"
import dotenv from "dotenv"
import helmet from "helmet"

// init dotenv
dotenv.config()

// local imports
import "./utils/nodeProcessHandler"
import gracefulShutdown from "./utils/gracefulShutdown"
import route from "./route"
import errorMiddleware from "./middlewares/error.mw"
import notFound from "./middlewares/notFound.mw"
import helth from "./middlewares/helth.mw"
import Err from "./utils/CustomError"

const app = express()

// middlewares
app.use(helmet())
app.use(express.json())

// route for the app
app.use("/api/v1", route)

// helth check route
app.use("/api/v1/helth", helth)

// delete later
// uncaught exception
app.use("/api/v1/uncaught-exception", (req, res, next) => {
  throw new Err(400, "uncaught-exception")
})
process.on("unhandledRejection", (_error: Err) => {
  app.use((_req, res, _next) => {
    res.status(500).json("jjjj")
  })
})
// delete later
// unhandled promise rejection
app.use("/api/v1/unhandled-promise-rejection", (_req, _res, _next) => {
  Promise.reject("unhandled-promise-rejection")
})

// 404 not found route (Catch All Route)
app.all("*", notFound)

// universal error handeler
app.use(errorMiddleware)

const bootstrap = (port: number): void => {
  const server = app.listen(port, () => {
    console.log(
      `App is liestening on http://localhost:${port}
Node Process ID is ${process.pid}`
    )
  })

  gracefulShutdown(server)
}

export default bootstrap
