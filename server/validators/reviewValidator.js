import Joi from "joi";

export const createReviewSchema = Joi.object({
    productId: Joi.string()
        .required()
        .messages({
            'string.empty': 'productId is required',
            'any.required': 'productId is required',
        }),
    rating: Joi.number()
        .min(1)
        .max(5)
        .required()
        .messages({
            'number.empty': 'Rating is required',
            'number.base': 'Rating must be a number',
            'number.min': 'Rating must be at least 1',
            'number.max': 'Rating must be at most 5',
        }),
    reviewText: Joi.string()
        .optional()
        .min(3)
        .messages({
            'string.empty': 'Review text cannot be empty',
            'string.min': 'Review text must be at least 3 characters long',
        })
})

export const updateReviewSchema = Joi.object({
    rating: Joi.number()
        .min(1)
        .max(5)
        .optional()
        .messages({
            'number.empty': 'Rating is required',
            'number.base': 'Rating must be a number',
            'number.min': 'Rating must be at least 1',
            'number.max': 'Rating must be at most 5',
        }),
    reviewText: Joi.string()
        .optional()
        .min(3)
        .messages({
            'string.empty': 'Review text cannot be empty',
            'string.min': 'Review text must be at least 3 characters long',
        })
})