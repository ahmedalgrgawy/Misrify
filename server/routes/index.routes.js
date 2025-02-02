import AppError from '../errors/AppError.js'
import authRoutes from './auth.routes.js'
import userRoutes from './user.routes.js'
import adminRoutes from './admin.routes.js'
import merchantRoutes from './merchant.routes.js'

export const wrapRoutes = (app) => {

    app.use("/api/auth", authRoutes)
    app.use("/api/user", userRoutes)
    app.use("/api/admin", adminRoutes)
    app.use("/api/merchant", merchantRoutes)

    app.use('*', (req, res, next) => {
        next(new AppError('invalid routing path ' + req.originalUrl, 404));
    });
}