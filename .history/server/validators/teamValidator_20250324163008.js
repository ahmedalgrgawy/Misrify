import Joi from "joi";

export const createTeamMemberSchema = Joi.object({
    name: Joi.string()
        .trim()
        .min(3)
        .max(50)
        .required()
        .messages({
            'string.empty': 'Name is required',
            'string.min': 'Name must be at least 3 characters long',
            'string.max': 'Name must be at most 50 characters long',
            'any.required': 'Name is required',
        }),

    email: Joi.string()
        .trim()
        .email()
        .required()
        .messages({
            'string.empty': 'Email is required',
            'string.email': 'Invalid email format',
            'any.required': 'Email is required',
        }),

    linkedIn: Joi.string()
        .trim()
        .uri()
        .optional()
        .allow("")
        .messages({
            'string.uri': 'Invalid LinkedIn URL',
        }),

    github: Joi.string()
        .trim()
        .uri()
        .optional()
        .allow("")
        .messages({
            'string.uri': 'Invalid GitHub URL',
        }),

    instagram: Joi.string()
        .trim()
        .uri()
        .optional()
        .allow("")
        .messages({
            'string.uri': 'Invalid Instagram URL',
        }),

    profileUrl: Joi.string()
        .trim()
        .uri()
        .optional()
        .allow("")
        .messages({
            'string.uri': 'Invalid Profile URL',
        }),

    jobTitle: Joi.string()
        .trim()
        .min(3)
        .max(100)
        .required()
        .messages({
            'string.empty': 'Job title is required',
            'string.min': 'Job title must be at least 3 characters long',
            'string.max': 'Job title must be at most 100 characters long',
            'any.required': 'Job title is required',
        }),
});

export const updateTeamMemberSchema = Joi.object({
    name: Joi.string()
        .trim()
        .min(3)
        .max(50)
        .optional()
        .messages({
            'string.min': 'Name must be at least 3 characters long',
            'string.max': 'Name must be at most 50 characters long',
        }),

    email: Joi.string()
        .trim()
        .email()
        .optional()
        .messages({
            'string.email': 'Invalid email format',
        }),

    linkedIn: Joi.string()
        .trim()
        .uri()
        .optional()
        .allow("")
        .messages({
            'string.uri': 'Invalid LinkedIn URL',
        }),

    github: Joi.string()
        .trim()
        .uri()
        .optional()
        .allow("")
        .messages({
            'string.uri': 'Invalid GitHub URL',
        }),

    instagram: Joi.string()
        .trim()
        .uri()
        .optional()
        .allow("")
        .messages({
            'string.uri': 'Invalid Instagram URL',
        }),

    profileUrl: Joi.string()
        .trim()
        .uri()
        .optional()
        .allow("")
        .messages({
            'string.uri': 'Invalid Profile URL',
        }),

    jobTitle: Joi.string()
        .trim()
        .min(3)
        .max(100)
        .optional()
        .messages({
            'string.min': 'Job title must be at least 3 characters long',
            'string.max': 'Job title must be at most 100 characters long',
        }),
});
