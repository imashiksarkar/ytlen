import type { Request, Response } from "express"
import { type Err, Http, Status } from "http-staror"
import Youtube from "../services/youtube.service"
import { NextFn } from "../libs/utils/types"

const yt = new Youtube()

export const getPlaylistDetails = async (
  req: Request,
  res: Response,
  next: NextFn
) => {
  const url = req.query.url as string
  if (!url) return next(Http.setStatus("BadRequest").setMessage("Invalid URL!"))

  try {
    const playlistRes = await yt.getDuration(url)
    return res.status(Status.Ok.code).json(playlistRes)
  } catch (error: unknown) {
    const Err = error as Err
    return next(Err)
  }
}
