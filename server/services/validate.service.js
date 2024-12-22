export const validate = (schema) => (req, res, next) => {

    const { error } = schema.validate(req.body);

    if (error) {
        const validationErrors = error.details.map((detail) => detail.message);
        return res.status(400).json({
            success: false,
            message: "Validation errors",
            errors: validationErrors,
        });
    } else {
        next();
    }
}