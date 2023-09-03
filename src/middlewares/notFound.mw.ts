import type { NextFunction, Request, Response } from "express"
import { Http } from "http-staror"

const notFound = (_req: Request, _res: Response, next: NextFunction) => {
  next(Http.setStatus("NotFound").setMessage("Route not found!"))
}

export default notFound
