import express, {
  ErrorRequestHandler,
  Request,
  Response,
  NextFunction,
} from "express"
import dotenv from "dotenv"

// init dotenv
dotenv.config()

// local imports
import route from "./route"
import errorMiddleware from "./middlewares/error.mw"
import notFound from "./middlewares/notFound.mw"

const app = express()

app.use(express.json())

app.use("/api/v1", route)

// helth check route
app.use("/api/v1/helth")

// 404 not found route
app.use(notFound)

// universal error handeler
app.use(errorMiddleware)

export default app
