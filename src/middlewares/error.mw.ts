import type { Request, Response } from 'express'
import { type Err } from 'http-staror'
import logger from '../libs/utils/logger'
import { type NextFn } from '../libs/utils/types'

const errorMiddleware = (
  err: Err,
  _req: Request,
  res: Response,
  _next: NextFn
) => {
  logger.error(`Status Code: ${err.statusCode} - Error: ${JSON.stringify(err)}`)
  return res.status(err.statusCode).json(err)
}

export default errorMiddleware
