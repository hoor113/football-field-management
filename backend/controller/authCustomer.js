import { Customer } from '../models/customer.model.js';
import jwt from 'jsonwebtoken';

// Đăng ký người dùng mới
export const register = async (req, res) => {
    const { username, password, fullname, sex, birthday, phone_no, email } = req.body;
    if (!(username && password && fullname && sex && birthday && phone_no && email)) {
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
        res.status(500).json({ message: 'An error occurred during registration' });
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
            return res.status(400).json({ message: 'Invalid credentials because error password or username' });
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

        res.status(200).json({ message: 'Customer login successful', token });

    } catch (error) {
        res.status(500).json({ message: 'An error occurred during login' });
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

export const getCustomer = async (req, res) => {
    try {
        console.log("Request user:", req.user)
        const customerGet = await Customer.findById(req.user.id).select('fullname')
        if (!customerGet) {
            return res.status(404).json({ message: "Failed to get full name"})
        }
        res.json({ fullname: customerGet.fullname })
    } catch (error) {
        res.status(500).json({ error: error.message })
    }
}

export const getProfile = async (req, res) => {
    try {
        const customer = await Customer.findById(req.user.id)
            .select('fullname username email phone_no');
        
        if (!customer) {
            return res.status(404).json({ message: "Không tìm thấy thông tin khách hàng" });
        }

        res.json({
            fullname: customer.fullname,
            username: customer.username,
            email: customer.email,
            phone: customer.phone_no
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
        const customer = await Customer.findById(req.user.id);
        if (!customer) {
            return res.status(404).json({ message: "Không tìm thấy thông tin khách hàng" });
        }

        // Kiểm tra email đã tồn tại chưa (trừ email hiện tại của user)
        const existingEmail = await Customer.findOne({ 
            email, 
            _id: { $ne: req.user.id } 
        });
        
        if (existingEmail) {
            return res.status(400).json({ message: "Email đã được sử dụng" });
        }

        // Nếu có currentPassword, kiểm tra và cập nhật password mới
        if (currentPassword) {
            const isPasswordValid = await customer.comparePassword(currentPassword);
            if (!isPasswordValid) {
                return res.status(400).json({ message: "Mật khẩu hiện tại không đúng" });
            }
            if (!newPassword) {
                return res.status(400).json({ message: "Vui lòng nhập mật khẩu mới" });
            }
            customer.password = newPassword;
        }

        // Cập nhật thông tin khác
        customer.fullname = fullname;
        customer.email = email;
        customer.phone_no = phone;

        await customer.save(); // Sử dụng save() để trigger middleware mã hóa password

        res.json({
            fullname: customer.fullname,
            username: customer.username,
            email: customer.email,
            phone: customer.phone_no
        });
    } catch (error) {
        res.status(500).json({ message: 'Lỗi khi cập nhật thông tin' });
    }
};
