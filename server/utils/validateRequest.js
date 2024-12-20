import AppError from "./AppError";

const validateRequest = (schema) => (req, res, next) => {
    const { error } = schema.validate(req.body, { abortEarly: false });

    if (error) {
        const errors = error.details.map((detail) => detail.message);
        return next(new AppError(errors.join(", "), 400));
    }

    next();
};

export default validateRequest;
