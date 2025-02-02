import Joi from "joi";

export const createCategorySchema = Joi.object({
    name: Joi.string().required().messages({
        "string.base": "Name must be a string",
        "string.empty": "Name cannot be empty",
        "any.required": "Name is required"
    }),
    description: Joi.string().required().messages({
        "string.base": "Description must be a string",
        "string.empty": "Description cannot be empty",
        "any.required": "Description is required"
    }),
})