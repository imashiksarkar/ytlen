import dayjs from "dayjs"
import { createLogger, format, transports } from "winston"
import env from "./validatedEnv"

const logFormat = ({ timestamp, level, message }: any) => {
  const ts = dayjs(timestamp)
    .locale("Asia/Almaty")
    .format("DD-MM-YYYY hh:mm:ss A")
  return `${ts} | [${level}] | ${message}`
}

let logger = createLogger({
  level: "debug",
  format: format.combine(
    format.timestamp(),
    format.colorize(),
    format.printf(logFormat)
  ),
  transports: [new transports.Console()],
})

if (env.nodeEnv === "production") {
  logger = createLogger({
    level: "info",
    format: format.combine(format.timestamp(), format.printf(logFormat)),
    transports: [
      new transports.File({
        level: "info",
        dirname: "logs",
        filename: "info.log",
      }),
    ],
  })
}

export default logger
