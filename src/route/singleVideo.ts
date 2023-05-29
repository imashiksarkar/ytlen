import { Router } from "express"
import { getVideoDetails } from "../controller/singleVideoController"

const router = Router()

router.get("/single", getVideoDetails)

export default router
