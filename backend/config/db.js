import mongoose from "mongoose"

export const ConnectDB = async() => {
    try {
        const connect = mongoose.connect(process.env.MONGO_URI);
        console.log("Successfully connect to database")
    } catch (error) {
        console.log("Failed to connect to database")
    }
}