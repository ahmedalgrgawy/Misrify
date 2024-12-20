import Joi from "joi";

const userValidationSchema = Joi.object({
    name: Joi.string().required().messages({
        "string.empty": "Name is required",
    }),
    email: Joi.string().email().lowercase().trim().required().messages({
        "string.email": "A valid email address is required",
        "string.empty": "Email is required",
    }),
    password: Joi.string().min(6).required().messages({
        "string.min": "Password must be at least 6 characters long",
        "string.empty": "Password is required",
    }),
    phoneNumber: Joi.string().required().messages({
        "string.empty": "Phone number is required",
    }),
    address: Joi.string().required().messages({
        "string.empty": "Address is required",
    }),
    gender: Joi.string().valid("male", "female").required().messages({
        "any.only": "Gender must be 'male' or 'female'",
        "string.empty": "Gender is required",
    }),
    role: Joi.string().valid("user", "admin", "merchant").default("user"),
    imgUrl: Joi.string().uri().optional().messages({
        "string.uri": "Image URL must be a valid URI",
    }),
    points: Joi.number().integer().default(0),
    purchaseHistory: Joi.array().items(Joi.any()).default([]),
    recommendedProduct: Joi.array().items(Joi.string().hex().length(24)).default([]),
    isVerified: Joi.boolean().default(false),
});
