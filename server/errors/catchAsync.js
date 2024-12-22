import AppError from "./AppError.js";

const catchAsync = (fn) => {
    return async (req, res, next) => {
        try {
            await fn(req, res, next);
        } catch (error) {
            next(new AppError(error, 500));
        }
    };
};

export default catchAsync;
