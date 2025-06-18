import Joi from "joi";

export const createProductSchema = Joi.object({
    name: Joi.string()
        .required()
        .messages({
            'string.empty': 'Name is required',
            'any.required': 'Name is required',
        }),

    categoryId: Joi.string()
        .pattern(/^[0-9a-fA-F]{24}$/) // ObjectId validation (24 hex characters)
        .required()
        .messages({
            'string.empty': 'Category is required',
            'any.required': 'Category is required',
        }),

    brandId: Joi.string()
        .pattern(/^[0-9a-fA-F]{24}$/) // ObjectId validation
        .required()
        .messages({
            'string.empty': 'Brand is required',
            'any.required': 'Brand is required',
        }),

    description: Joi.string()
        .required()
        .messages({
            'string.empty': 'Description is required',
            'any.required': 'Description is required',
        }),

    quantityInStock: Joi.number()
        .integer()
        .min(0)
        .required()
        .messages({
            'number.base': 'Quantity must be a number',
            'number.min': 'Quantity must be at least 0',
            'any.required': 'Quantity is required',
        }),

    price: Joi.number()
        .positive()
        .required()
        .messages({
            'number.base': 'Price must be a number',
            'number.positive': 'Price must be greater than 0',
            'any.required': 'Price is required',
        }),

    colors: Joi.array()
        .items(Joi.string())
        .optional()
        .messages({
            'array.base': 'Colors must be an array of strings',
        }),

    sizes: Joi.array()
        .items(Joi.string())
        .optional()
        .messages({
            'array.base': 'Sizes must be an array of strings',
        }),

    // until front integrations

    imgUrl: Joi.string()
        .uri()
        .optional()
        .messages({
            'string.empty': 'Image URL is required',
            'string.uri': 'Image must be a valid URL',
            'any.required': 'Image URL is required',
        }),

    isDiscounted: Joi.boolean()
        .default(false)
        .optional()
        .messages({
            'boolean.base': 'isDiscounted must be a boolean',
        }),

    discountAmount: Joi.number()
        .min(0)
        .default(0)
        .optional()
        .messages({
            'number.base': 'Discount amount must be a number',
            'number.min': 'Discount amount cannot be negative',
        }),

    isApproved: Joi.boolean()
        .default(false)
        .messages({
            'boolean.base': 'isApproved must be a boolean',
        }),
});

export const editProductSchema = Joi.object({
    name: Joi.string().optional().messages({
        "string.empty": "Name is required",
    }),
    categoryId: Joi.string().pattern(/^[0-9a-fA-F]{24}$/).optional().messages({
        "string.empty": "Category is required",
    }),
    brandId: Joi.string().pattern(/^[0-9a-fA-F]{24}$/).optional().messages({
        "string.empty": "Brand is required",
    }),
    description: Joi.string().optional().messages({
        "string.empty": "Description is required",
    }),
    quantityInStock: Joi.number().integer().min(0).optional().messages({
        "number.base": "Quantity must be a number",
        "number.min": "Quantity must be at least 0",
    }),
    price: Joi.number().positive().optional().messages({
        "number.base": "Price must be a number",
        "number.positive": "Price must be greater than 0",
    }),
    colors: Joi.array().items(Joi.string()).optional(),
    sizes: Joi.array().items(Joi.string()).optional(),
    imgUrl: Joi.string().uri().optional().messages({
        "string.uri": "Image must be a valid URL",
    }),
    isDiscounted: Joi.boolean().optional().messages({
        "boolean.base": "isDiscounted must be a boolean",
    }),
    discountAmount: Joi.number().min(0).optional().messages({
        "number.base": "Discount amount must be a number",
        "number.min": "Discount amount cannot be negative",
    }),
})