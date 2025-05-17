
import express from "express"
import dotenv from "dotenv"
import { ConnectDB } from "./config/db.js"
import customerRouter from "#backend/routes/customerRouter.js"
import ownerRouter from "#backend/routes/ownerRouter.js"
import router3 from "#backend/routes/fieldRouter.js"
import tournamentRouter from "#backend/routes/tournamentsRouter.js"
import cors from 'cors'
import cookieParser from "cookie-parser"
import path from "path"
import swaggerUi from 'swagger-ui-express';
import { specs } from '#backend/config/swagger.js';




dotenv.config()

const app = express()
app.use(cors({
    origin: ['http://localhost:3000', "https://footballfieldmanagement.web.app"]
}));  

app.use(express.json())
app.use(cookieParser())

const PORT = process.env.PORT || 5000

// Routes
app.use("/api/customer", customerRouter);



// Route cho chủ sân (field owner)
app.use("/api/field_owner", ownerRouter);
app.use("/api/field", router3);


//route tổ chức giải đấu
app.use("/api/tournaments", tournamentRouter)

// Thêm route cho Swagger UI (thêm vào trước các routes khác)
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(specs));

const __dirname = path.resolve()

if (process.env.NODE_ENV === 'production') {
  app.use(express.static(path.join(__dirname, "/frontend/build")))

  app.get("*", (req, res) => {
    res.sendFile(path.resolve(__dirname, "frontend", "build", "index.html"))
  })
}

app.listen(PORT, () => {
    ConnectDB()
    console.log("Success!")
    console.log("Server started at http://localhost:" + PORT)
})