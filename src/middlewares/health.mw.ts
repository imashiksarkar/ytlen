import type { NextFunction, Request, Response } from "express"

const healthCheck = (req: Request, res: Response, next: NextFunction) => {
  res.sendStatus(200)
}

export default healthCheck
