import type { Request, Response, NextFunction } from "express"
import { Err } from "http-staror"

const errorMiddleware = (
  err: Err,
  _req: Request,
  res: Response,
  _next: NextFunction
) => res.status(err.statusCode).json(err)

export default errorMiddleware
