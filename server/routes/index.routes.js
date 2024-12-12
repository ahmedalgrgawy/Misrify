import authRoutes from './auth.routes.js'
import userRoutes from './user.routes.js'

export const wrapRoutes = (app) => {
    app.use("/api/auth", authRoutes)
    app.use("/api/user", userRoutes)
}