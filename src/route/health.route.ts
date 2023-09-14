import { Router } from "express"
import health from "../middlewares/health.mw"

const router = Router()

// health check route
router.get("/health", health)

export default router
