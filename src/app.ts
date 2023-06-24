import express, {
  ErrorRequestHandler,
  Request,
  Response,
  NextFunction,
} from "express"
import dotenv from "dotenv"

// init dotenv
dotenv.config()

import route from "./route"

const app = express()

app.use(express.json())

app.use("/api/v1", route)

// helth check route
app.use("/api/v1/helth", (req: Request, res: Response, next: NextFunction) => {
  res.sendStatus(200)
})

// 404 not found route
app.use((req: Request, res: Response, next: NextFunction) => {
  next({
    status: 404,
    message: "Not found!",
  })
})

// Error handling middleware
interface CustomErr extends ErrorRequestHandler {
  status: number
  message: string
}
app.use((err: CustomErr, req: Request, res: Response, next: NextFunction) => {
  res.status(err.status).json(err)
})

export default app
