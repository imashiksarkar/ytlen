import { Router } from "express"
import playlist from "./playlist.route"
import singleVideo from "./single-video.route"
import health from "./health.route"
import log from "./log.route"
import notFound from "./notFound.route"

const router = Router()

router.use("/yt", playlist, singleVideo, log, health, notFound)

export default router
