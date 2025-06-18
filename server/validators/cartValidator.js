import Joi from "joi";

export const addToCartSchema = Joi.object({
  productId: Joi.string()
    .regex(/^[0-9a-fA-F]{24}$/)
    .required()
    .messages({
      'string.pattern.base': 'Invalid product ID format',
      'string.empty': 'Product ID is required',
      'any.required': 'Product ID is required',
    }),

  quantity: Joi.number()
    .integer()
    .min(1)
    .required()
    .messages({
      'number.base': 'Quantity must be a number',
      'number.integer': 'Quantity must be an integer',
      'number.min': 'Quantity must be at least 1',
      'any.required': 'Quantity is required',
    }),

    color: Joi.string().trim().required().messages({
        'string.empty': 'Color cannot be empty',
      }),
      size: Joi.string().trim().required().messages({
        'string.empty': 'Size cannot be empty',
      }),
      
});

export const updateCartItemQuantitySchema = Joi.object({
  cartItemId: Joi.string()
    .regex(/^[0-9a-fA-F]{24}$/)
    .required()
    .messages({
      'string.pattern.base': 'Invalid cart item ID format',
      'string.empty': 'Cart item ID is required',
      'any.required': 'Cart item ID is required',
    }),

  operation: Joi.string()
    .valid("add", "minus")
    .required()
    .messages({
      'string.empty': 'Operation is required',
      'any.required': 'Operation is required',
      'any.only': 'Operation must be either "add" or "minus"',
    }),
});

export const removeFromCartSchema = Joi.object({
  cartItemId: Joi.string()
    .regex(/^[0-9a-fA-F]{24}$/)
    .required()
    .messages({
      'string.pattern.base': 'Invalid cart item ID format',
      'string.empty': 'Cart item ID is required',
      'any.required': 'Cart item ID is required',
    }),
});

export const clearCartSchema = Joi.object({});
