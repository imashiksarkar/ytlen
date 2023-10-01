import { Router } from "express"
import { getLogs } from "../controllers/log.controller"

const router = Router()

router.get("/logs", getLogs)

export default router
