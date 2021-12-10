import Joi from 'joi';

import { userRoles, utils } from '../constants';

const { EMAIL_REGEX, PASS_REGEX } = utils;

export class UsersGuard {
    private static userValidator = Joi.object({
        id: Joi.string()
            .trim()
            .alter({
                post: (schema) => schema.required(),
                put: (schema) => schema.forbidden(),
            }),
        name: Joi.string()
            .trim()
            .alphanum()
            .min(3)
            .max(20)
            .alter({
                post: (schema) => schema.required(),
            }),
        email: Joi.string()
            .trim()
            .regex(EMAIL_REGEX)
            .alter({
                post: (schema) => schema.required(),
            }),
        password: Joi.string()
            .trim()
            .regex(PASS_REGEX)
            .alter({
                post: (schema) => schema.required(),
            }),
        role: Joi.number()
            .allow(...Object.values(userRoles))
            .alter({
                post: (schema) => schema.default(userRoles.USER),
            }),
    }).min(1);

    public static createUserValidator = UsersGuard.userValidator.tailor('post');
    public static updateUserValidator = UsersGuard.userValidator.tailor('put');
}
