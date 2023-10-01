import { Router } from "express"
import notFound from "../middlewares/notFound.mw"

const route = Router()

// 404 not found route (Catch All Route)
route.all("*", notFound)

export default route
