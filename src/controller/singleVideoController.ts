import { NextFunction, Request, Response } from "express"
import Err from "../utils/CustomError"
import Youtube from "../services/YoutubeServices"

const yt = new Youtube()

export const getVideoDetails = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const url = req.query.url as string
  if (!url) return next({ status: 400, message: "Bad Request" })

  try {
    const vidRes = await yt.getSingleVideoDetails(url)

    res.status(200).json(vidRes)
  } catch (error: any) {
    const Err = error as Err
    return next(Err)
  }
}
