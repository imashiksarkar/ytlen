import type { NextFunction, Request, Response } from "express"
import { Http } from "http-staror"

const notFound = (req: Request, _res: Response, next: NextFunction) =>
  next(
    Http.setStatus("NotFound").setMessage(
      `(${req.originalUrl}) Route not found!`
    )
  )

export default notFound
