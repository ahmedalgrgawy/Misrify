import Joi from "joi";

export const createBrandSchema = Joi.object({
    name: Joi.string().required().messages({
        "string.empty": "Name is required",
    }),
    description: Joi.string().required().messages({
        "string.empty": "Description is required",
    }),
    ownerId: Joi.string().required().messages({
        "string.empty": "Owner is required",
    }),
    imgUrl: Joi.string().optional().messages({
        "string.empty": "Image URL is optional",
    }),
})

export const editBrandSchema = Joi.object({
    name: Joi.string().optional().messages({
        "string.empty": "There is No Name Provided",
    }),
    description: Joi.string().optional().messages({
        "string.empty": "There is No Description Provided",
    }),
    imgUrl: Joi.string().optional().messages({
        "string.empty": "Image URL is optional",
    }),
})