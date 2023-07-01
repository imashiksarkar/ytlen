import { IncomingMessage, Server, ServerResponse } from "http"

const gracefulShutdown = (
  server: Server<typeof IncomingMessage, typeof ServerResponse>
) => {
  // sigint (Ctrl + C)
  process.on("SIGINT", () => {
    console.log("graceful shutdown. (sigint)")

    // winstone
    server.close(() => process.exit(0))
  })

  // sigterm (Kill <pid>)
  process.on("SIGTERM", () => {
    console.log("graceful shutdown. (sigterm)")

    // winstone
    server.close(() => process.exit(0))
  })
}

export default gracefulShutdown
