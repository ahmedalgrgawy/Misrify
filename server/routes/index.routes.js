import authRoutes from './auth.routes.js'

export const wrapRoutes = (app) => {
    app.use("/api/auth", authRoutes)
}