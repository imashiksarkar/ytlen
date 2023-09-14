import { NextFunction, Request, Response } from "express"
import { Http } from "http-staror"
import { createReadStream } from "node:fs"

export const getLogs = async (
  _req: Request,
  res: Response,
  next: NextFunction
) => {
  res.header("Content-Type", "Text/Plain")
  const readStream = createReadStream("logs/info.log")
  readStream.on("error", () =>
    next(Http.setStatus("InternalServerError").setMessage("Error Reading File"))
  )
  return readStream.pipe(res)
}
