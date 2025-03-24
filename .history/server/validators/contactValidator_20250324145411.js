import Joi from "joi";

export const contactSchema = Joi.object({
    firstName: Joi.string().min(2).max(50).required(),
    lastName: Joi.string().min(2).max(50).required(),
    email: Joi.string().email().required(),
    phone: Joi.string()
    .pattern(/^(010|011|012|015)[0-9]{8}$/)
    .required()
    .messages({ "string.pattern.base": "Phone number must be a valid Egyptian mobile number" }),

    message: Joi.string().min(10).max(500).required(),
});
