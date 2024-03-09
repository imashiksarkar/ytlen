import type { Request, Response } from 'express'
import { Http } from 'http-staror'
import { createReadStream } from 'node:fs'
import { type NextFn } from '../libs/utils/types'

export const getLogs = (
  _req: Request,
  res: Response,
  next: NextFn
): Response<any, Record<string, any>> => {
  res.header('Content-Type', 'Text/Plain')
  const readStream = createReadStream('logs/info.log')
  readStream.on('error', () => {
    next(
      Http.setStatus('InternalServerError').setMessage(
        "Error Reading File, Check to see if the 'env' is set to production"
      )
    )
  })
  return readStream.pipe(res)
}
