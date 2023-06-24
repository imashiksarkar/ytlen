import type { NextFunction, Request, Response } from "express"

const helthCheck = (req: Request, res: Response, next: NextFunction) => {
  res.sendStatus(200)
}

export default helthCheck
