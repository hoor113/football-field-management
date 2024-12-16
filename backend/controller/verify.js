import jwt from "jsonwebtoken"

export const authenticateToken = (req, res, next) => {
    const token = req.cookies.token

    if (!token) {
        return res.status(401).json({message: "Phiên đăng nhập không xác định, token không tồn tại"})
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET)
        if (!decoded || !decoded.id) {
            return res.status(400).json({ message: 'Token không đúng cấu trúc.' });
        }

        req.user = decoded
        next()
    } catch (error) {
        return res.status(403).json({message: "Token không đúng hoặc đã hết hạn"})
    }
}

export const checkRole = (allowedRoles) => (req, res, next) => {
    const userRole = req.user.role; // Lấy thông tin role từ token
    if (!allowedRoles.includes(userRole)) {
      return res.status(403).json({ message: "Không có quyền truy cập" });
    }
    next();
  };