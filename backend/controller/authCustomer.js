import { Customer } from '../models/customer.model.js';
import jwt from 'jsonwebtoken';

// Đăng ký người dùng mới
export const register = async (req, res) => {
    const { username, password, fullname, sex, birthday, phone_no, email } = req.body;
    if (!(username || password || fullname || sex || birthday || phone_no || email)) {
        return res.status(400).json({ success: false, message: "Please provide all fields" });
    }

    try {
        // Kiểm tra nếu username hoặc email đã tồn tại
        const existingUser = await Customer.findOne({ $or: [{ username }, { email }] });
        if (existingUser) {
            return res.status(400).json({ message: 'Username or Email already exists' });
        }

        // Tạo người dùng mới
        const newCustomer = new Customer({
            username,
            password, // Sẽ được mã hóa trong middleware trước khi lưu
            fullname,
            sex,
            birthday,
            phone_no,
            email
        });

        // Lưu người dùng vào cơ sở dữ liệu
        await newCustomer.save();

        res.status(201).json({ message: 'Customer registered successfully', user: newCustomer });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Đăng nhập người dùng
export const login = async (req, res) => {
    const { username, password } = req.body;

    // Kiểm tra xem có username và password không
    if (!username || !password) {
        return res.status(400).json({ message: 'Username and password are required' });
    }

    try {
        // Tìm người dùng theo username
        const customer = await Customer.findOne({ username });
        if (!customer) {
            return res.status(400).json({ message: 'Invalid credentials' });
        }

        // Kiểm tra mật khẩu
        const isMatch = await customer.comparePassword(password);
        if (!isMatch) {
            return res.status(400).json({ message: 'Invalid credentials because error password' });
        }

        // Kiểm tra biến môi trường JWT_SECRET
        if (!process.env.JWT_SECRET) {
            return res.status(500).json({ message: 'JWT secret is not defined' });
        }

        // Tạo JWT token
        const token = jwt.sign(
            { id: customer._id, username: customer.username },
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
