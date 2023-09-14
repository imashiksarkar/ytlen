import { Router } from "express"
import { getLogs } from "../controller/log.controller"

const router = Router()

router.get("/logs", getLogs)

export default router
