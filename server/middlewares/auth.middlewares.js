import jwt from 'jsonwebtoken'
import dotenv from 'dotenv'
import User from '../models/user.model.js'
import AppError from '../errors/AppError.js'
dotenv.config()

export const protectedRoute = async (req, res, next) => {
    const accessToken = req.cookies.accessToken

    if (accessToken) {

        try {
            const decodedToken = jwt.verify(accessToken, process.env.JWT_SECRET)

            const user = await User.findById(decodedToken.userId).select('-password')

            if (!user) return next(new AppError("Unauthorized, User Not Found", 401))

            req.user = user;

            next()
        } catch (error) {
            if (error.name === 'TokenExpiredError') {
                return next(new AppError("Unauthorized, Token Expired", 401))
            }
            throw error;
        }
    } else {
        return next(new AppError("Unauthorized, No Token Provided", 401))
    }
}

export const customerRoute = (req, res, next) => {
    if (req.user && req.user.role === 'user') {
        next()
    } else {
        return next(new AppError("Unauthorized, You Are Not Customer", 401))
    }
}

export const adminRoute = (req, res, next) => {
    if (req.user && req.user.role === 'admin') {
        next()
    } else {
        return next(new AppError("Unauthorized, You Are Not Admin", 401))
    }
}

export const merchantRoute = (req, res, next) => {

    if (req.user && req.user.role === 'merchant') {
        next()
    } else {
        return next(new AppError("Unauthorized, You Are Not Merchant", 401))
    }
}

export const userAndMerchantRoute = (req, res, next) => {

    if (req.user && (req.user.role === 'user' || req.user.role === 'merchant')) {
        next()
    } else {
        return next(new AppError("Unauthorized, You Are Not Allowed", 401))
    }
}

export const adminAndMerchantRoute = (req, res, next) => {
    if (req.user && (req.user.role === 'admin' || req.user.role === 'merchant')) {
        next()
    } else {
        return next(new AppError("Unauthorized, You Are Not Allowed", 401))
    }
}