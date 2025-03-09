import { Customer } from '#backend/models/customer.model.js';
import jwt from 'jsonwebtoken';

//customer/profile
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
