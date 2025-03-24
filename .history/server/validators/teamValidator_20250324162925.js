import Joi from "joi";

export const createTeamMemberSchema = Joi.object({
    name: Joi.string().trim().min(3).max(50).required(),
    email: Joi.string().trim().email().required(),
    linkedIn: Joi.string().trim().uri().optional().allow(""),
    github: Joi.string().trim().uri().optional().allow(""),
    instagram: Joi.string().trim().uri().optional().allow(""),
    profileUrl: Joi.string().trim().uri().optional().allow(""),
    jobTitle: Joi.string().trim().min(3).max(100).required(),
});

export const updateTeamMemberSchema = Joi.object({
    name: Joi.string().trim().min(3).max(50).optional(),
    email: Joi.string().trim().email().optional(),
    linkedIn: Joi.string().trim().uri().optional().allow(""),
    github: Joi.string().trim().uri().optional().allow(""),
    instagram: Joi.string().trim().uri().optional().allow(""),
    profileUrl: Joi.string().trim().uri().optional().allow(""),
    jobTitle: Joi.string().trim().min(3).max(100).optional(),
});
