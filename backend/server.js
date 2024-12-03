import express from "express"
import dotenv from "dotenv"
import { ConnectDB } from "./config/db.js"
import router1 from "./routes/authRoutesCustomer.js"
import router2 from "./routes/authRoutesFieldOwner.js"
import router3 from "./routes/fieldOwners.js"
import cors from 'cors'
import cookieParser from "cookie-parser"
import path from "path"
import { Field } from "./models/field.model.js"

dotenv.config()

const app = express()
app.use(cors({
    origin: 'http://localhost:3000'
}));  

app.use(express.json())
app.use(cookieParser())

const PORT = process.env.PORT || 5000

// Function to update ground states
async function updateGroundStates() {
    try {
        const currentTime = new Date();
        const currentHour = currentTime.getHours();
        
        const fields = await Field.find({});
        
        for (const field of fields) {
            let hasUpdates = false;
            
            field.grounds.forEach(ground => {
                ground.occupied_slots.forEach(slot => {
                    const slotEndHour = parseInt(slot.end_time.split(':')[0]);
                    if (currentHour >= slotEndHour && slot.status === 'occupied') {
                        slot.status = 'vacant';
                        hasUpdates = true;
                    }
                });
            });

            if (hasUpdates) {
                await field.save();
            }
        }
    } catch (error) {
        console.error('Error updating ground states:', error);
    }
}

setInterval(updateGroundStates, 60 * 60 * 1000);
updateGroundStates();

// Routes
app.use("/api/customer", router1);
app.use("/api/field_owner", router2);
app.use("/api/field", router3);

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