import type { Request, Response } from 'express'
import { Status } from 'http-staror'

const healthCheck = (
  _req: Request,
  res: Response
): Response<any, Record<string, any>> => res.sendStatus(Status.Ok.code)

export default healthCheck
