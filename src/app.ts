import express from "express"
import dotenv from "dotenv"

// local imports
import route from "./route"
import errorMiddleware from "./middlewares/error.mw"
import notFound from "./middlewares/notFound.mw"
import helth from "./middlewares/helth.mw"

const app = express()

// init dotenv
dotenv.config()
app.use(express.json())

app.use("/api/v1", route)

// helth check route
app.use("/api/v1/helth", helth)

// 404 not found route
app.use(notFound)

// universal error handeler
app.use(errorMiddleware)

export default app
