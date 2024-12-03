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
            return res.status(400).json({ message: 'Invalid credentials because error password or username' });
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

export const getProfile = async (req, res) => {
    try {
        const fieldOwner = await FieldOwner.findById(req.user.id)
            .select('fullname username email phone_no');
        
        if (!fieldOwner) {
            return res.status(404).json({ message: "Không tìm thấy thông tin chủ sân" });
        }

        res.json({
            fullname: fieldOwner.fullname,
            username: fieldOwner.username,
            email: fieldOwner.email,
            phone: fieldOwner.phone_no
        });
    } catch (error) {
        res.status(500).json({ message: 'Lỗi khi lấy thông tin profile' });
    }
};

export const updateProfile = async (req, res) => {
    try {
        const { fullname, email, phone, currentPassword, newPassword } = req.body;
        
        // Validate input
        if (!fullname || !email || !phone) {
            return res.status(400).json({ message: "Vui lòng điền đầy đủ thông tin" });
        }

        // Tìm customer hiện tại
        const fieldOwner = await FieldOwner.findById(req.user.id);
        if (!fieldOwner) {
            return res.status(404).json({ message: "Không tìm thấy thông tin chủ sân" });
        }

        // Kiểm tra email đã tồn tại chưa (trừ email hiện tại của user)
        const existingEmail = await FieldOwner.findOne({ 
            email, 
            _id: { $ne: req.user.id } 
        });
        
        if (existingEmail) {
            return res.status(400).json({ message: "Email đã được sử dụng" });
        }

        // Nếu có currentPassword, kiểm tra và cập nhật password mới
        if (currentPassword) {
            const isPasswordValid = await fieldOwner.comparePassword(currentPassword);
            if (!isPasswordValid) {
                return res.status(400).json({ message: "Mật khẩu hiện tại không đúng" });
            }
            if (!newPassword) {
                return res.status(400).json({ message: "Vui lòng nhập mật khẩu mới" });
            }
            fieldOwner.password = newPassword;
        }

        // Cập nhật thông tin khác
        fieldOwner.fullname = fullname;
        fieldOwner.email = email;
        fieldOwner.phone_no = phone;

        await fieldOwner.save(); // Sử dụng save() để trigger middleware mã hóa password

        res.json({
            fullname: fieldOwner.fullname,
            username: fieldOwner.username,
            email: fieldOwner.email,
            phone: fieldOwner.phone_no
        });
    } catch (error) {
        res.status(500).json({ message: 'Lỗi khi cập nhật thông tin' });
    }
};

export const getPostedFieldsCount = async (req, res) => {
    try {
        const fieldOwnerId = req.user.id; // Giả sử ID người dùng có sẵn trong req.user

        // Tìm chủ sân và đếm số lượng sân
        const fieldOwner = await FieldOwner.findById(fieldOwnerId).populate('fields');
        const postedFieldsCount = fieldOwner ? fieldOwner.fields.length : 0;

        res.json({ count: postedFieldsCount });
    } catch (error) {
        console.error('Lỗi khi lấy số sân đã đăng:', error);
        res.status(500).json({ message: 'Có lỗi xảy ra khi lấy số sân đã đăng' });
    }
};
