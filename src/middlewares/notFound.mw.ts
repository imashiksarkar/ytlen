import type { Request, Response } from "express"
import { Http } from "http-staror"
import { NextFn } from "../libs/utils/types"

const notFound = (req: Request, _res: Response, next: NextFn) =>
  next(
    Http.setStatus("NotFound").setMessage(
      `(${req.originalUrl}) Route not found!`
    )
  )

export default notFound
