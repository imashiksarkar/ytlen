import type { Err } from "http-staror"
import { logger, validatedEnv } from "."

class NodeProcessHandler {
  static config = () => {
    // catch an unhandled error
    process.on("uncaughtException", (error: Err) => {
      if (validatedEnv.nodeEnv === "development")
        console.error("uncaughtException")
      logger.error(`[ uncaughtException ] ${error.message}`)
      process.exit(1)
    })

    // catch an unhandled promise rejection
    process.on("unhandledRejection", (errorMessage: string) => {
      if (validatedEnv.nodeEnv === "development")
        console.error("unhandledRejection")
      logger.error(`[ unhandledRejection ] ${errorMessage}`)
      process.exit(1)
    })
  }
}

export default NodeProcessHandler
