import { Request, Response, NextFunction } from "express"
import Youtube from "../services/YoutubeServices"
import Err from "../utils/CustomError"

const yt = new Youtube()

export const getPlaylistDetails = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { url } = req.query
  if (!url) return next({ status: 400, message: "Bad Request" })

  try {
    const playlistRes = await yt.getPlaylistDetails(url as string)

    res.status(200).json(playlistRes)
  } catch (error: any) {
    const Err = error as Err
    return next(Err)
  }
}
