import { Router } from 'express'
import healthRoute from './health.route'
import logRoute from './log.route'
import playlistRoute from './playlist.route'
import singleVideoRoute from './single-video.route'

const router = Router()

router.use(healthRoute)
router.use('/yt', playlistRoute, singleVideoRoute, logRoute)

export default router
