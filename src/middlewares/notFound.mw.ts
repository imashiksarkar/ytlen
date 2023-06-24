import type { NextFunction, Request, Response } from "express"

const notFound = (req: Request, res: Response, next: NextFunction) => {
  next({
    status: 404,
    message: "Not found!",
  })
}

export default notFound
