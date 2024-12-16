import { Customer } from '../models/customer.model.js';
import jwt from 'jsonwebtoken';

/**
 * @swagger
 * /api/customer/register:
 *   post:
 *     summary: Đăng ký tài khoản khách hàng
 *     tags: [Auth Customer]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - username
 *               - password
 *               - fullname
 *               - sex
 *               - birthday
 *               - phone_no
 *               - email
 *             properties:
 *               username:
 *                 type: string
 *               password:
 *                 type: string
 *               fullname:
 *                 type: string
 *               sex:
 *                 type: string
 *               birthday:
 *                 type: string
 *                 format: date
 *               phone_no:
 *                 type: string
 *               email:
 *                 type: string
 *     responses:
 *       201:
 *         description: Đăng ký thành công
 *       400:
 *         description: Dữ liệu không hợp lệ
 *       500:
 *         description: Lỗi server
 */
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

/**
 * @swagger
 * /api/customer/login:
 *   post:
 *     summary: Đăng nhập tài khoản khách hàng
 *     tags: [Auth Customer]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - username
 *               - password
 *             properties:
 *               username:
 *                 type: string
 *               password:
 *                 type: string
 *     responses:
 *       200:
 *         description: Đăng nhập thành công
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                 token:
 *                   type: string
 *       400:
 *         description: Username hoặc password không đúng
 *       500:
 *         description: Lỗi server
 */
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
            { id: customer._id,
            username: customer.username ,
            role: "customer"
        },
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

/**
 * @swagger
 * /api/customer/logout:
 *   post:
 *     summary: Đăng xuất
 *     tags: [Auth Customer]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Đăng xuất thành công
 */
export const logout = (req, res) => {
    res.clearCookie('token', {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'Strict',
    });
    res.status(200).json({ message: 'Logged out successfully' });
};

/**
 * @swagger
 * /api/customer/profile:
 *   get:
 *     summary: Lấy thông tin profile khách hàng
 *     tags: [Profile]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Thành công
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 fullname:
 *                   type: string
 *                 username:
 *                   type: string
 *                 email:
 *                   type: string
 *                 phone:
 *                   type: string
 *       404:
 *         description: Không tìm thấy thông tin khách hàng
 */
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

/**
 * @swagger
 * /api/customer/profile/update:
 *   put:
 *     summary: Cập nhật thông tin profile khách hàng
 *     tags: [Profile]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               fullname:
 *                 type: string
 *               phone_no:
 *                 type: string
 *               email:
 *                 type: string
 *     responses:
 *       200:
 *         description: Cập nhật thành công
 *       404:
 *         description: Không tìm thấy thông tin khách hàng
 */
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

/**
 * @swagger
 * /api/customer:
 *   get:
 *     summary: Lấy thông tin cơ bản của khách hàng
 *     tags: [Profile]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Thành công
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 fullname:
 *                   type: string
 *       404:
 *         description: Không tìm thấy thông tin khách hàng
 *       500:
 *         description: Lỗi server
 */
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

