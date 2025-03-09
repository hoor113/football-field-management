import { FieldOwner } from '#backend/models/field-owner.model.js';
import jwt from 'jsonwebtoken';
// import express from "express"
// import { Field } from '#backend/models/field.model.js';

/**
 * @swagger
 * /api/field_owner/register:
 *   post:
 *     summary: Đăng ký tài khoản chủ sân
 *     tags: [Auth Field Owner]
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
        return res.status(400).json({ success: false, message: "Xin hãy điền đầy đủ thông tin" });
    }

    try {
        // Kiểm tra nếu username hoặc email đã tồn tại
        const existingFieldOwner = await FieldOwner.findOne({ $or: [{ username }, { email }] });
        if (existingFieldOwner) {
            return res.status(400).json({ message: 'Tên đăng nhập hoặc Email đã được sử dụng' });
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

        res.status(201).json({ message: 'Chủ sân đã đăng ký thành công', user: newFieldOwner });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

/**
 * @swagger
 * /api/field_owner/login:
 *   post:
 *     summary: Đăng nhập tài khoản chủ sân
 *     tags: [Auth Field Owner]
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
        return res.status(400).json({ message: 'Tên đăng nhập và mật khẩu là bắt buộc' });
    }

    try {
        // Tìm chủ sân theo username
        const fieldOwner = await FieldOwner.findOne({ username });
        if (!fieldOwner) {
            return res.status(400).json({ message: 'Tên đăng nhập hoặc mật khẩu không đúng' });
        }

        // Kiểm tra mật khẩu
        const isMatch = await fieldOwner.comparePassword(password);
        if (!isMatch) {
            return res.status(400).json({ message: 'Tên đăng nhập hoặc mật khẩu không đúng' });
        }

        // Kiểm tra biến môi trường JWT_SECRET
        if (!process.env.JWT_SECRET) {
            return res.status(500).json({ message: 'Môi trường chưa được xác định' });
        }

        // Tạo JWT token
        const token = jwt.sign(
            { id: fieldOwner._id,
                username: fieldOwner.username,
                role: "fieldOwner"
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

        res.status(200).json({ message: 'Đăng nhập thành công', token });
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
    res.status(200).json({ message: 'Đăng xuất thành công' });
};  

export const getFieldOwner = async (req, res) => {
    try {
        console.log("Request user:", req.user)
        const fieldOwnerGet = await FieldOwner.findById(req.user.id).select('fullname')
        if (!fieldOwnerGet) {
            return res.status(404).json({ message: "Không tìm thấy tên chủ sân"})
        }
        res.json({ fullname: fieldOwnerGet.fullname })
    } catch (error) {
        res.status(500).json({ error: error.message })
    }
}

// export const getFieldOwnerById = async (req, res) => {
//     const { ownerId } = req.params;
//     try {
//         const fieldOwner = await FieldOwner.findById(ownerId);
//         res.json(fieldOwner.fullname);
//     } catch (error) {
//         res.status(500).json({ error: error.message });
//     }
// };


// owner/profile
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
