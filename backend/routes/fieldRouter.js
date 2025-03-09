import { Router } from "express"
import { UploadField, UploadService, UploadServiceType } from "#backend/controller/field-owner.func.js"
import { authenticateToken } from "#backend/controller/verify.js"
import { getRecommendedFields, SearchFields, HPsearchFields } from "#backend/controller/customer.func.js"

// api/field
const router3 = Router()

router3.post("/", authenticateToken, UploadField)
router3.post("/service", authenticateToken, UploadService)
router3.post("/servicetype", authenticateToken, UploadServiceType)
router3.get("/fields", authenticateToken, getRecommendedFields)
router3.get("/search", authenticateToken, SearchFields)
router3.get('/fields/search', HPsearchFields)
export default router3