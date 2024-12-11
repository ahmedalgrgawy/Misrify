import jwt from 'jsonwebtoken'
import dotenv from 'dotenv'
import User from '../models/user.model.js'
dotenv.config()

export const protectedRoute = async (req, res, next) => {
    try {

        const accessToken = req.cookies.accessToken

        if (accessToken) {

            try {
                const decodedToken = jwt.verify(accessToken, process.env.ACCESS_TOKEN_SECRET)

                const user = await User.findById(decodedToken.userId).select('-password')

                if (!user) return res.status(401).json({ success: false, message: "Unauthorized, User Not Found" })

                req.user = user;

                next()
            } catch (error) {
                if (error.name === 'TokenExpiredError') {
                    return res.status(401).json({ success: false, message: "Unauthorized, Token Expired" })
                }
                throw error;
            }
        } else {
            return res.status(401).json({ success: false, message: "Unauthorized, No Token Provided" })
        }

    } catch (error) {
        return res.status(401).json({ success: false, message: "Unauthorized" })
    }
}