import express from "express"
import dotenv from "dotenv"
import { ConnectDB } from "./config/db.js"
import router1 from "./routes/authRoutesCustomer.js"
import router2 from "./routes/authRoutesFieldOwner.js"
import cors from 'cors'

dotenv.config()

const app = express()
app.use(cors({
    origin: 'http://localhost:3000' // Địa chỉ frontend ReactJS của bạn
  }));  

app.use(express.json())
const PORT = process.env.PORT || 5000



app.use(express.json())



// app.use((req, res) => {
//     console.log("Requesting ", req)
//     console.log("Responding ", res)
// })

// Route cho người dùng (customer)
app.use("/api/customer", router1);

// Route cho chủ sân (field owner)
app.use("/api/fieldOwner", router2);

// app.get('/', (req, res) => {
//     res.send()
// })


app.listen(PORT, () => {
    ConnectDB()
    console.log("Success!")
    console.log("Server started at http://localhost:" + PORT)
})