import { Router } from "express"
import { getVideoDetails } from "../controller/single-video.controller"

const router = Router()

router.get("/single", getVideoDetails)

export default router
