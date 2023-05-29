import { Router } from "express"
import playlist from "./playlist"
import singleVideo from "./singleVideo"

const router = Router()

router.use("/yt", playlist, singleVideo)

export default router
