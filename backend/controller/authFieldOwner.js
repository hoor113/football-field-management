import { FieldOwner } from '../models/field-owner.model.js';
import jwt from 'jsonwebtoken';
import express from "express"
import { Field } from '../models/field.model.js';

// Đăng ký chủ sân mới
export const register = async (req, res) => {
    const { username, password, fullname, sex, birthday, phone_no, email } = req.body;
    if (!(username && password && fullname && sex && birthday && phone_no && email)) {
        return res.status(400).json({ success: false, message: "Please provide all fields" });
    }

    try {
        // Kiểm tra nếu username hoặc email đã tồn tại
        const existingFieldOwner = await FieldOwner.findOne({ $or: [{ username }, { email }] });
        if (existingFieldOwner) {
            return res.status(400).json({ message: 'Username or Email already exists' });
        }

        // Tạo chủ sân mới
        const newFieldOwner = new FieldOwner({
            username,
            password, // Sẽ được mã hóa trong middleware trước khi lưu
            fullname,
            sex,
            birthday,
            phone_no,
            email
        });

        // Lưu chủ sân vào cơ sở dữ liệu
        await newFieldOwner.save();

        res.status(201).json({ message: 'FieldOwner registered successfully', user: newFieldOwner });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Đăng nhập chủ sân
export const login = async (req, res) => {
    const { username, password } = req.body;

    // Kiểm tra xem có username và password không
    if (!username || !password) {
        return res.status(400).json({ message: 'Username and password are required' });
    }

    try {
        // Tìm chủ sân theo username
        const fieldOwner = await FieldOwner.findOne({ username });
        if (!fieldOwner) {
            return res.status(400).json({ message: 'Invalid credentials' });
        }

        // Kiểm tra mật khẩu
        const isMatch = await fieldOwner.comparePassword(password);
        if (!isMatch) {
            return res.status(400).json({ message: 'Invalid credentials because error password' });
        }

        // Kiểm tra biến môi trường JWT_SECRET
        if (!process.env.JWT_SECRET) {
            return res.status(500).json({ message: 'JWT secret is not defined' });
        }

        // Tạo JWT token
        const token = jwt.sign(
            { id: fieldOwner._id, username: fieldOwner.username },
            process.env.JWT_SECRET,
            { expiresIn: '1h' }
        );

        res.cookie('token', token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'Strict',
            maxAge: 60 * 60 * 1000 // 1 hour
        });

        res.status(200).json({ message: 'Login successful', token });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

export const logout = (req, res) => {
    res.clearCookie('token', {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'Strict',
    });
    res.status(200).json({ message: 'Logged out successfully' });
};

export const getFieldOwner = async (req, res) => {
    try {
        console.log("Request user:", req.user)
        const fieldOwnerGet = await FieldOwner.findById(req.user.id).select('fullname')
        if (!fieldOwnerGet) {
            return res.status(404).json({ message: "Failed to get full name"})
        }
        res.json({ fullname: fieldOwnerGet.fullname })
    } catch (error) {
        res.status(500).json({ error: error.message })
    }
}
