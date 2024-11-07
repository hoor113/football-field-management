import jwt from "jsonwebtoken"

export const authenticateToken = (req, res, next) => {
    const token = req.cookies.token

    if (!token) {
        return res.status(401).json({message: "Unauthorized, token missing"})
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET)
        req.userId = decoded.id
        next()
    } catch (error) {
        return res.status(403).json({message: "Token is invalid or expired"})
    }
}