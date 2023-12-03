import { Router } from 'express'
import { getPlaylistDetails } from '../controllers/playlist.controller'

const router = Router()

router.get('/playlist', getPlaylistDetails)

export default router
