import { Router } from 'express'
import health from '../controllers/health.controller'

const router = Router()

// health check route
router.get('/health', health)

export default router
