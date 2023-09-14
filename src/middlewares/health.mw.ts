import { Request, Response } from "express"
import { Status } from "http-staror"

const healthCheck = (_req: Request, res: Response) =>
  res.sendStatus(Status.Ok.code)

export default healthCheck
