import jwt from "jsonwebtoken"
import redis from "../lib/redis.js"

export const generateToken = (userId) => {
    const accessToken = jwt.sign({ userId }, process.env.JWT_SECRET, { expiresIn: '15m' })

    const refreshToken = jwt.sign({ userId }, process.env.JWT_REFRESH_TOKEN, { expiresIn: '7d' })

    return { accessToken, refreshToken }
}

export const storeTokenInRedis = async (userId, refreshToken) => {
    await redis.set(`refreshToken_${userId}`, refreshToken, 'EX', 60 * 60 * 24 * 7)
}

export const storeTokenInCookies = (res, accessToken, refreshToken) => {
    res.cookie('accessToken', accessToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV !== 'development',
        sameSite: 'strict',
        maxAge: 15 * 60 * 1000
    })
    res.cookie('refreshToken', refreshToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV !== 'development',
        sameSite: 'strict',
        maxAge: 60 * 60 * 24 * 7 * 1000
    })
}