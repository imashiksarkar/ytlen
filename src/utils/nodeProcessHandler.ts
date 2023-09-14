import type { Err } from "http-staror"
import logger from "../utils/logger"
import env from "./validatedEnv"

// catch an unhandled error
process.on("uncaughtException", (error: Err) => {
  if (env.nodeEnv === "development") console.error("uncaughtException")
  logger.error(`[ uncaughtException ] ${error.message}`)
  process.exit(1)
})

// catch an unhandled promise rejection
process.on("unhandledRejection", (errorMessage: string) => {
  if (env.nodeEnv === "development") console.error("unhandledRejection")
  logger.error(`[ unhandledRejection ] ${errorMessage}`)
  process.exit(1)
})
