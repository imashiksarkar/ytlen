import type {
  Request,
  Response,
  ErrorRequestHandler,
  NextFunction,
} from "express"

// Error handling middleware
interface CustomErr extends ErrorRequestHandler {
  status: number
  message: string
}

const errorMiddleware = (
  err: CustomErr,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  res.status(err.status).json(err)
}

export default errorMiddleware
