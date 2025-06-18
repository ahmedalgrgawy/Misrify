import dotenv from "dotenv";

dotenv.config();

const errorHandler = (err, req, res, next) => {
    let { statusCode, message } = err;

    // Default to 500 if statusCode isn't set
    if (!statusCode) {
        statusCode = 500;
    }

    if (process.env.NODE_ENV === "development") {
        console.error("Error:", err);
        return res.status(statusCode).json({
            success: false,
            message,
            stack: err.stack,
        });
    }

    return res.status(statusCode).json({
        success: false,
        message: err.isOperational ? message : "Server Error",
    });
};

export default errorHandler;
