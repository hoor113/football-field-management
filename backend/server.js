import express from "express"
import dotenv from "dotenv"
import { ConnectDB } from "./config/db.js"
import router from "./routes/authRoutes.js"


const app = express()
app.use(express.json())
const PORT = process.env.PORT || 5000

dotenv.config()

console.log(process.env.MONGO_URI)

// app.use((req, res) => {
//     console.log("Requesting ", req)
//     console.log("Responding ", res)
// })

app.use('/api', router);

// app.get('/', (req, res) => {
//     res.send()
// })

app.listen(PORT, () => {
    ConnectDB()
    console.log("Success!")
    console.log("Server started at http://localhost:" + PORT)
})