import { Router } from "express"
import { UploadField, UploadService } from "../controller/field-owner.func"
import { authenticateToken } from "../controller/verify"

const router = Router()
router.post("/field", authenticateToken, UploadField)
router.post("/field/service", authenticateToken, UploadService)

export default router