import Joi from 'joi';

import { constants, userRoles } from '../constants/index.js';

const { EMAIL_REGEX, PASS_REGEX } = constants;

export class UsersGuard { static createUserValidator = Joi.object({
        id: Joi.string().trim().required(),
        name: Joi.string().trim().alphanum().min(3).max(20).required(),
        email: Joi.string().trim().regex(EMAIL_REGEX).required(),
        password: Joi.string().trim().regex(PASS_REGEX).required(),
        role: Joi.string()
            .trim()
            .allow(...Object.values(userRoles))
            .default(userRoles.USER),
    });

    public static updateUserValidator = Joi.object({
        name: Joi.string().alphanum().min(3).max(20),
        email: Joi.string().trim().regex(EMAIL_REGEX),
        password: Joi.string().trim().regex(PASS_REGEX),
        role: Joi.string()
            .trim()
            .allow(...Object.values(userRoles)),
    }).min(1);
}
