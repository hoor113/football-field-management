import mongoose from "mongoose"
import { Field } from "../models/field.model.js"
import { FieldOwner } from "../models/field-owner.model.js";

export const UploadField = async (req, res) => { 
    const {name, address, base_price, image_url, total_grounds} = req.body;
    if (!(name || address|| base_price || image_url || total_grounds)) {
        return res.status(400).json({ success: false, message: "Please provide all fields" });
    }

    try {
        const owner_id = req.userId
        console.log(req.userId)
        const NewField = new Field({
            owner_id,
            name,
            address,
            base_price,
            image_url,
            total_grounds
        });
        const fieldId = await NewField.save()
        // TODO: Add grounds
        
        //
        await FieldOwner.findByIdAndUpdate(owner_id, { $push: { fields: fieldId._id}})

        return res.status(201).json({ success: true, message: "Field created successfully" });
    } catch (error) {
        return res.status(500).json({ success: false, message: "An error occurred", error: error.message });
    }
}


export const UploadService = async (req, res) => {
    // TODO:
    const {name, type, price} = req.body;
    if (!(name || type || price)) {
        return res.status(400).json({ success: false, message: "Please provide all fields" });
    }
}

