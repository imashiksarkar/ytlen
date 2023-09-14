import type { IncomingMessage, Server, ServerResponse } from "http"
import logger from "../utils/logger"

const gracefulShutdown = (
  server: Server<typeof IncomingMessage, typeof ServerResponse>
) => {
  // sigint (Ctrl + C)
  process.on("SIGINT", () => {
    logger.info("[ Ctrl + C ] Graceful shutdown.")
    server.close(() => process.exit(0))
  })

  // sigterm (Kill <pid>)
  process.on("SIGTERM", () => {
    logger.info(`[ Kill ${process.pid} ] Graceful shutdown.`)
    server.close(() => process.exit(0))
  })
}

export default gracefulShutdown
