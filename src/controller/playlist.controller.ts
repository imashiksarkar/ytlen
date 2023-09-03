import { Request, Response, NextFunction } from "express"
import Youtube from "../services/youtube.service"
import { Err, Http,Status } from "http-staror"

const yt = new Youtube()

export const getPlaylistDetails = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const url = req.query.url as string
  if (!url) return next(Http.setStatus("BadRequest").setMessage("Invalid URL!"))

  try {
    const playlistRes = await yt.getPlaylistDetails(url)
    res.status(Status.Ok.code).json(playlistRes)
  } catch (error: unknown) {
    const Err = error as Err
    return next(Err)
  }
}
