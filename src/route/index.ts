import { Router } from "express"
import playlist from "./playlist.route"
import singleVideo from "./single.video.route"

const router = Router()

router.use("/yt", playlist, singleVideo)

export default router
