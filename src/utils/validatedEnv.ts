import { z } from "zod"
import dotenv from "dotenv"

dotenv.config()

const apiKey = z.string().min(10).parse(process.env.API_KEY)

const nodeEnv = z
  .enum(["development", "production"])
  .parse(process.env.NODE_ENV)

const port = z
  .number()
  .min(4)
  .parse(parseInt(process.env.PORT || ""))

export default { apiKey, nodeEnv, port }
