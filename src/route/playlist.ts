import { Router } from "express"
import { getPlaylistDetails } from "../controller/playlistController"

const router = Router()

router.get("/playlist", getPlaylistDetails)

export default router
