import { NextFunction, Request, Response } from "express"
import Youtube from "../services/youtube.service"
import { Err, Http, Status } from "http-staror"

const yt = new Youtube()

export const getVideoDetails = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const url = req.query.url as string
  if (!url) return next(Http.setStatus("BadRequest").setMessage("Invalid URL!"))

  try {
    const vidRes = await yt.getVideoDetails(url)
    return res.status(Status.Ok.code).json(vidRes)
  } catch (error: unknown) {
    const Err = error as Err
    return next(Err)
  }
}
