import type { Request, Response } from 'express'
import Youtube from '../services/youtube.service'
import { type Err, Http, Status } from 'http-staror'
import { type NextFn } from '../libs/utils/types'

const yt = new Youtube()

export const getVideoDetails = async (
  req: Request,
  res: Response,
  next: NextFn
): Promise<Response<any, Record<string, any>> | undefined> => {
  const url = req.query.url as string
  if (!url) {
    next(Http.setStatus('BadRequest').setMessage('Invalid URL!'))
    return
  }

  try {
    const vidRes = await yt.getDuration(url)
    return res.status(Status.Ok.code).json(vidRes)
  } catch (error: unknown) {
    const Err = error as Err
    next(Err)
  }
}
