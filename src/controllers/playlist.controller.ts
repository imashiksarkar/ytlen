import type { Request, Response } from "express"
import { type Err, Http, Status } from "http-staror"
import Youtube from "../services/youtube.service"

const yt = new Youtube()

export const getPlaylistDetails = async (
  req: Request,
  res: Response,
  next: NextFn
) => {
  const url = req.query.url as string
  if (!url) return next(Http.setStatus("BadRequest").setMessage("Invalid URL!"))

  try {
    const playlistRes = await yt.getPlaylistDetails(url)
    return res.status(Status.Ok.code).json(playlistRes)
  } catch (error: unknown) {
    const Err = error as Err
    return next(Err)
  }
}
