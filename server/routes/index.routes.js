import authRoutes from './auth.routes.js'
import userRoutes from './user.routes.js'

export const wrapRoutes = (app) => {

    app.use((req, res, next) => {
        res.status(404).json({
            success: false,
            message: "Route not found",
        });
    });

    app.use("/api/auth", authRoutes)
    app.use("/api/user", userRoutes)
}