import Joi from "joi";

export const signupValidationSchema = Joi.object({
    name: Joi.string().required().messages({
        "string.empty": "Name is required",
    }),
    email: Joi.string().email().lowercase().trim().required().messages({
        "string.email": "A valid email address is required",
        "string.empty": "Email is required",
    }),
    password: Joi.string().min(6).required().messages({
        "string.min": "Password must be at least 6 characters long",
        "string.empty": "Password is required",
    }),
    phoneNumber: Joi.number().required().messages({
        "number.empty": "Phone number is required",
    }),
    address: Joi.string().required().messages({
        "string.empty": "Address is required",
    }),
    gender: Joi.string().valid("male", "female").required().messages({
        "any.only": "Gender must be 'male' or 'female'",
        "string.empty": "Gender is required",
    })
});

export const verifyEmailValidationSchema = Joi.object({
    email: Joi.string().email().lowercase().trim().required().messages({
        "string.email": "A valid email address is required",
        "string.empty": "Email is required",
    }),
    otp: Joi.number().required().messages({
        "number.empty": "OTP is required",
    }),
})

export const loginValidationSchema = Joi.object({
    email: Joi.string().email().lowercase().trim().required().messages({
        "string.email": "A valid email address is required",
        "string.empty": "Email is required",
    }),
    password: Joi.string().min(6).required().messages({
        "string.min": "Password must be at least 6 characters long",
        "string.empty": "Password is required",
    }),
})

export const forgotPasswordValidationSchema = Joi.object({
    email: Joi.string().email().lowercase().trim().required().messages({
        "string.email": "A valid email address is required",
        "string.empty": "Email is required",
    }),
})

export const resetPasswordValidationSchema = Joi.object({
    email: Joi.string().email().lowercase().trim().required().messages({
        "string.email": "A valid email address is required",
        "string.empty": "Email is required",
    }),
    resetPasswordOtp: Joi.string().required().messages({
        "string.empty": "OTP is required",
    }),
    newPassword: Joi.string().min(6).required().messages({
        "string.min": "Password must be at least 6 characters long",
        "string.empty": "Password is required",
    }),
})

export const updateUserSchema = Joi.object({
    name: Joi.string().optional().messages({
        "string.empty": "Name is required",
    }),
    email: Joi.string().email().lowercase().trim().optional().messages({
        "string.email": "A valid email address is required",
        "string.empty": "Email is required",
    }),
    phoneNumber: Joi.number().optional().messages({
        "number.empty": "Phone number is required",
    }),
    address: Joi.string().optional().messages({
        "string.empty": "Address is required",
    }),
    gender: Joi.string().valid("male", "female").optional().messages({
        "any.only": "Gender must be 'male' or 'female'",
        "string.empty": "Gender is required",
    }),
    currentPassword: Joi.string().min(6).optional().messages({
        "string.min": "Password must be at least 6 characters long",
        "string.empty": "Password is required",
    }),
    newPassword: Joi.string().min(6).optional().messages({
        "string.min": "Password must be at least 6 characters long",
        "string.empty": "Password is required",
    }),
    imgUrl: Joi.string().optional().messages({
        "string.empty": "ImgUrl is required",
    }),
})

export const createUserSchema = Joi.object({
    name: Joi.string().required().messages({
        "string.empty": "Name is required",
    }),
    email: Joi.string().email().lowercase().trim().required().messages({
        "string.email": "A valid email address is required",
        "string.empty": "Email is required",
    }),
    password: Joi.string().min(6).required().messages({
        "string.min": "Password must be at least 6 characters long",
        "string.empty": "Password is required",
    }),
    phoneNumber: Joi.number().optional().messages({
        "number.empty": "Phone number is required",
    }),
    address: Joi.string().optional().messages({
        "string.empty": "Address is required",
    }),
    role: Joi.string().required().messages({
        "string.empty": "Role is required",
    }),
    gender: Joi.string().optional().messages({
        "string.empty": "Gender is required",
    }),
})

export const editUserSchema = Joi.object({
    name: Joi.string().optional().messages({
        "string.empty": "Name is required",
    }),
    phoneNumber: Joi.number().optional().messages({
        "number.empty": "Phone number is required",
    }),
    address: Joi.string().optional().messages({
        "string.empty": "Address is required",
    }),
    role: Joi.string().optional().messages({
        "string.empty": "Role is required",
    }),
})