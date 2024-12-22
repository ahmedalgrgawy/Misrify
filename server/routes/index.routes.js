import AppError from '../utils/AppError.js'
import authRoutes from './auth.routes.js'
import userRoutes from './user.routes.js'

export const wrapRoutes = (app) => {

    app.use("/api/auth", authRoutes)
    app.use("/api/user", userRoutes)

    app.use('*', (req, res, next) => {
        next(new AppError('invalid routing path ' + req.originalUrl, 404));
    });
}