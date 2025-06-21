import Joi from 'joi';

// Create order validation schema
export const createOrderSchema = Joi.object({
    orderItems: Joi.array()
        .items(
            Joi.object({
                product: Joi.string().required().messages({
                    'any.required': 'Product ID is required',
                    'objectId.invalid': 'Product ID must be a valid ID',
                }),
                quantity: Joi.number().integer().min(1).required().messages({
                    'number.base': 'Quantity must be a number',
                    'number.min': 'Quantity must be at least 1',
                    'any.required': 'Quantity is required',
                }),
                color: Joi.string().required().messages({
                    'string.base': 'Color must be a string',
                    'any.required': 'Color is required',
                }),
                size: Joi.string().required().messages({
                    'string.base': 'Size must be a string',
                    'any.required': 'Size is required',
                }),
                price: Joi.number().min(0).required().messages({  // ✅ NEW FIELD ADDED HERE
                    'number.base': 'Price must be a number',
                    'number.min': 'Price must be at least 0',
                    'any.required': 'Price is required for order item',
                }),
            })
        )
        .min(1)
        .required()
        .messages({
            'array.min': 'At least one order item is required',
            'any.required': 'Order items are required',
        }),

    shippingAddress: Joi.string().required().messages({
        'string.base': 'Shipping address must be a string',
        'any.required': 'Shipping address is required',
    }),

    shippingMethod: Joi.string()
        .valid('standard', 'express', 'overnight')
        .default('standard')
        .messages({
            'string.base': 'Shipping method must be a string',
            'any.only': 'Shipping method must be one of: standard, express, overnight',
        }),

    coupon: Joi.string().optional().messages({
        'string.base': 'Coupon must be a string',
    }),
});

export const editOrderSchema = Joi.object({
    shippingAddress: Joi.string().optional(),
    shippingMethod: Joi.string().valid('standard', 'express', 'overnight').optional(),
    couponCode: Joi.string().optional(),
    // Original orderItems schema for backward compatibility
    orderItems: Joi.array().items(
        Joi.object({
            orderItemId: Joi.string().required().messages({
                'string.empty': 'Order item ID is required',
                'any.required': 'Order item ID is required'
            }),
            quantity: Joi.number().integer().min(1).optional().messages({
                'number.base': 'Quantity must be a number',
                'number.min': 'Quantity must be at least 1'
            }),
            color: Joi.string().optional().messages({
                'string.base': 'Color must be a string'
            }),
            size: Joi.string().optional().messages({
                'string.base': 'Size must be a string'
            })
        })
    ).optional(),

    // New itemOperations schema for add, update, delete operations
    itemOperations: Joi.array().items(
        Joi.object({
            // Required type field to specify the operation
            type: Joi.string().valid('add', 'update', 'delete').required().messages({
                'string.empty': 'Operation type is required',
                'any.required': 'Operation type is required',
                'any.only': 'Operation type must be add, update, or delete'
            }),

            // Fields for 'add' operation
            productId: Joi.string().when('type', {
                is: 'add',
                then: Joi.required(),
                otherwise: Joi.forbidden()
            }).messages({
                'string.empty': 'Product ID is required for add operation',
                'any.required': 'Product ID is required for add operation',
                'any.unknown': 'Product ID should only be provided for add operation'
            }),

            // Fields for 'update' and 'delete' operations
            orderItemId: Joi.string().when('type', {
                is: Joi.valid('update', 'delete'),
                then: Joi.required(),
                otherwise: Joi.forbidden()
            }).messages({
                'string.empty': 'Order item ID is required for update/delete operations',
                'any.required': 'Order item ID is required for update/delete operations',
                'any.unknown': 'Order item ID should only be provided for update/delete operations'
            }),

            // Common fields that can be used in 'add' and 'update' operations
            quantity: Joi.number().integer().min(1).when('type', {
                is: Joi.valid('add', 'update'),
                then: Joi.optional(),
                otherwise: Joi.forbidden()
            }).messages({
                'number.base': 'Quantity must be a number',
                'number.min': 'Quantity must be at least 1',
                'any.unknown': 'Quantity should only be provided for add/update operations'
            }),

            color: Joi.string().when('type', {
                is: Joi.valid('add', 'update'),
                then: Joi.optional(),
                otherwise: Joi.forbidden()
            }).messages({
                'string.base': 'Color must be a string',
                'any.unknown': 'Color should only be provided for add/update operations'
            }),

            size: Joi.string().when('type', {
                is: Joi.valid('add', 'update'),
                then: Joi.optional(),
                otherwise: Joi.forbidden()
            }).messages({
                'string.base': 'Size must be a string',
                'any.unknown': 'Size should only be provided for add/update operations'
            })
        })
    ).optional()
}).or('shippingAddress', 'shippingMethod', 'orderItems', 'itemOperations').messages({
    'object.missing': 'At least one field to update must be provided'
});

export const paymentValidationSchema = Joi.object({
    orderId: Joi.string().required(),
    cardNumber: Joi.string().pattern(/^[0-9]{16}$/).required(),
    cardExpiryMonth: Joi.string().pattern(/^(0[1-9]|1[0-2])$/).required(),
    cardExpiryYear: Joi.string().pattern(/^[0-9]{2}$/).required(),
    cardCvv: Joi.string().pattern(/^[0-9]{3,4}$/).required(),
    cardHolderName: Joi.string().min(3).max(100).required(),
    billingAddress: Joi.object({
        street: Joi.string().required(),
        city: Joi.string().required(),
        state: Joi.string().required(),
        country: Joi.string().required(),
        postalCode: Joi.string().required()
    }).required()
});