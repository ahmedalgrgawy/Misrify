import Joi from "joi";

export const createCommentSchema = Joi.object({
    text: Joi.string()
        .required()
        .min(3)
        .messages({
            'string.empty': 'Review text cannot be empty',
            'string.min': 'Review text must be at least 3 characters long',
        }),
    reviewId: Joi.string()
        .required()
        .messages({
            'string.empty': 'reviewId is required',
            'any.required': 'reviewId is required',
        }),

})

export const updateCommentSchema = Joi.object({
    text: Joi.string()
        .required()
        .min(3)
        .messages({
            'string.empty': 'Review text cannot be empty',
            'string.min': 'Review text must be at least 3 characters long',
        }),
})