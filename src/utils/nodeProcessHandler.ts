import { Err } from "http-staror"

// catch an unhandled error
process.on("uncaughtException", (error: Err) => {
  // winston
  console.log("uncaughtException", error.message)
  process.exit(1)
})

// catch an unhandled promise rejection
process.on("unhandledRejection", (error: string) => {
  // winston
  console.log("unhandledRejection", error)
  process.exit(1)
})
