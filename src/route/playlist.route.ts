import { Router } from "express"
import { getPlaylistDetails } from "../controller/playlist.controller"

const router = Router()

router.get("/playlist", getPlaylistDetails)

export default router
