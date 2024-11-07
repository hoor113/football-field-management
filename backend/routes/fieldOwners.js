import { Router } from "express"
import { UploadField, UploadService } from "../controller/field-owner.func.js"
import { authenticateToken } from "../controller/verify.js"

const router3 = Router()
router3.post("/", authenticateToken, UploadField)
router3.post("/service", authenticateToken, UploadService)

export default router3