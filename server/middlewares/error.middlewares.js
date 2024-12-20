const errorHandler = (err, req, res, next) => {
    let { statusCode, message } = err;

    // Default to 500 if statusCode isn't set
    if (!statusCode) statusCode = 500;

    // Log errors in development
    if (process.env.NODE_ENV === "development") {
        console.error("Error:", err);
        return res.status(statusCode).json({
            success: false,
            message,
            stack: err.stack,
        });
    }

    // In production, avoid exposing stack traces
    return res.status(statusCode).json({
        success: false,
        message: err.isOperational ? message : "Something went wrong",
    });
};

export default errorHandler;
