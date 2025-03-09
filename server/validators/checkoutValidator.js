import Joi from 'joi';

// Create order validation schema
export const createOrderSchema = Joi.object({
    orderItems: Joi.array().items(
        Joi.object({
            product: Joi.string().required().messages({
                'any.required': 'Product ID is required',
                'objectId.invalid': 'Product ID must be a valid ID'
            }),
            quantity: Joi.number().integer().min(1).required().messages({
                'number.base': 'Quantity must be a number',
                'number.min': 'Quantity must be at least 1',
                'any.required': 'Quantity is required'
            }),
            color: Joi.string().required().messages({
                'string.base': 'Color must be a string',
                'any.required': 'Color is required'
            }),
            size: Joi.string().required().messages({
                'string.base': 'Size must be a string',
                'any.required': 'Size is required'
            }),
        })
    ).min(1).required().messages({
        'array.min': 'At least one order item is required',
        'any.required': 'Order items are required'
    }),
    shippingAddress: Joi.string().required().messages({
        'string.base': 'Shipping address must be a string',
        'any.required': 'Shipping address is required'
    }),
    shippingMethod: Joi.string().valid('standard', 'express', 'overnight').default('standard').messages({
        'string.base': 'Shipping method must be a string',
        'any.only': 'Shipping method must be one of: standard, express, overnight'
    }),
    coupon: Joi.string().optional().messages({
        'string.base': "coupon muse be a string",
    })
});

// Update order validation schema
export const updateOrderSchema = Joi.object({
    shippingAddress: Joi.string().optional().messages({
        'string.base': 'Shipping address must be a string'
    }),
    shippingMethod: Joi.string().valid('standard', 'express', 'overnight').optional().messages({
        'string.base': 'Shipping method must be a string',
        'any.only': 'Shipping method must be one of: standard, express, overnight'
    }),
    status: Joi.string().valid('pending', 'success', 'failed').optional().messages({
        'string.base': 'Status must be a string',
        'any.only': 'Status must be one of: pending, success, failed'
    })
});
