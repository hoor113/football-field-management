import express from "express"
import dotenv from "dotenv"
import { ConnectDB } from "./config/db.js"

const app = express()
const PORT = process.env.PORT || 5000

dotenv.config()

app.use(express.json())

app.get('/', (req, res) => {
    res.send()
})

app.listen(PORT, () => {
    ConnectDB()
    console.log("Success!")
    console.log("Server started at http://localhost:" + PORT)
})