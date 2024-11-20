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
    const {fieldId, name, type, price} = req.body;
    if (!(fieldId || name || type || price)) {
        return res.status(400).json({ success: false, message: "Please provide all fields" });
    }
    
    try {
        const field = await Field.findById(fieldId)
        if (!field) {
            return res.status(404).json({ message: 'Field not found' });
        }
        field.services.push({name, type, price})
        await field.save()
        res.status(200).json({ message: 'Service added successfully', field });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
}

export const GetFields = async (req, res) => {
    try {
        console.log('Fetching fields for user ID:', req.user.id);
        
        // Find the field owner and populate the fields array
        const fieldOwner = await FieldOwner.findById(req.user.id)
            .populate({
                path: 'fields',
                // populate: {
                //     path: 'services' // If you want to populate services as well
                // }
            });

        if (!fieldOwner) {
            return res.status(404).json({
                success: false,
                message: "Field owner not found"
            });
        }

        console.log('Found fields:', fieldOwner.fields);
        
        return res.status(200).json({
            success: true,
            fields: fieldOwner.fields
        });
    } catch (error) {
        console.error('Get Fields Error:', error);
        return res.status(500).json({
            success: false,
            message: "Error fetching fields",
            error: error.message
        });
    }
};

