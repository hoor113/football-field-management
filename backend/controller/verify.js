import jwt from "jsonwebtoken"

export const authenticateToken = (req, res, next) => {
    const token = req.cookies.token

    if (!token) {
        return res.status(401).json({message: "Unauthorized, token missing"})
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET)
        if (!decoded || !decoded.id) {
            return res.status(400).json({ message: 'Invalid token structure.' });
        }

        req.user = decoded
        next()
    } catch (error) {
        return res.status(403).json({message: "Token is invalid or expired"})
    }
}