import mongoose from "mongoose"
import { Field } from "../models/field.model.js"

export const UploadField = async ((req, res) => {
    const field = req.body
    if (!field.name || !field.address || !field.base_price || !field.image_url || !field.total_grounds) {
        return res.status(400).json({ success: false, message: "Pleasse provide all fields"})
    }

    const NewField = new Field(field)
})


export const UploadService = async ((req, res) => {
    await
})

