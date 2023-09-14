import type { Request, Response, NextFunction } from "express"
import { type Err } from "http-staror"
import logger from "../utils/logger"

const errorMiddleware = (
  err: Err,
  _req: Request,
  res: Response,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  _next: NextFunction
) => {
  logger.error(`Status Code: ${err.statusCode} - Error: ${JSON.stringify(err)}`)
  return res.status(err.statusCode).json(err)
}

export default errorMiddleware
