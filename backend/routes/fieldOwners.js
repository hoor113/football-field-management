import { Router } from "express"
import { UploadField, UploadService } from "../controller/field-owner.func"

const router = Router()
router.post("/field", UploadField)
router.post("/field/service", UploadService)

export default router