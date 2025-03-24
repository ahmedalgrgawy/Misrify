import Joi from "joi";

export const contactSchema = Joi.object({
    firstName: Joi.string().min(2).max(50).required(),
    lastName: Joi.string().min(2).max(50).required(),
    email: Joi.string().email().required(),
    phone: Joi.string()
        .pattern(/^[0-9]{10,12}$/)
        .required()
        .messages({ "string.pattern.base": "Phone number must be 10-15 digits" }),
    message: Joi.string().min(10).max(500).required(),
});
