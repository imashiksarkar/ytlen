import Err from "./CustomError"

// catch an unhandled error
process.on("uncaughtException", (error: Err) => {
  // winstone
  console.log("uncaughtException", error.message)
  process.exit(1)
})

// catch an unhandled promise rejection
process.on("unhandledRejection", (error: string) => {
  // winstone
  console.log("unhandledRejection", error)
  process.exit(1)
})
