import { Router } from "express"
import { UploadField, UploadService } from "../controller/field-owner.func.js"
import { authenticateToken } from "../controller/verify.js"

// api/field
const router3 = Router()

router3.post("/", authenticateToken, UploadField)
// router3.put("/:field_id", authenticateToken, UpdateField)
router3.post("/service", authenticateToken, UploadService)

export default router3