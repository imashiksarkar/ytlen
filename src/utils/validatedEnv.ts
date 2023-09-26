import { z } from "zod"
import dotenv from "dotenv"

dotenv.config()

const apiKey = z
  .string({ required_error: "Api key is required." })
  .min(10, "Api key must be larger than 10 characters.")
  .parse(process.env.API_KEY?.trim())

const nodeEnv = z
  .enum(["development", "production"])
  .parse(process.env.NODE_ENV?.trim() || "production")

const port = z
  .number()
  .min(4)
  .parse(parseInt(process.env.PORT?.trim() || "5000"))

export default { apiKey, nodeEnv, port }
