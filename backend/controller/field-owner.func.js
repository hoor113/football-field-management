import mongoose from "mongoose"
import { Field } from "../models/field.model.js"

export const UploadField = async (req, res) => { 
    const {name, address, base_price, image_url, total_grounds} = req.body;
    if (!(name || address|| base_price || image_url || total_grounds)) {
        return res.status(400).json({ success: false, message: "Please provide all fields" });
    }

    try {
        const NewField = new Field(field);
        await NewField.save();
        return res.status(201).json({ success: true, message: "Field created successfully" });
    } catch (error) {
        return res.status(500).json({ success: false, message: "An error occurred", error: error.message });
    }
}


export const UploadService = async (req, res) => {
    
}

