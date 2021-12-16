import Joi from 'joi';

import { userRoles, utils } from '../constants';

const { EMAIL_REGEX, PASS_REGEX, MONGO_BD_ID_REGEX } = utils;

export class UsersGuard {
    private static watchlistValidator = Joi.object({
        title: Joi.string().min(3).max(40),
        movies: Joi.array().items(Joi.string().regex(MONGO_BD_ID_REGEX)),
    });

    private static userValidator = Joi.object({
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
        age: Joi.number()
            .min(12)
            .max(99)
            .alter({
                post: (schema) => schema.required(),
            }),
        watchlist: Joi.array().items(UsersGuard.watchlistValidator),
        favorites: Joi.array().items(Joi.string().regex(MONGO_BD_ID_REGEX)),
    }).min(1);

    public static createUserValidator = UsersGuard.userValidator.tailor('post');
    public static updateUserValidator = UsersGuard.userValidator.tailor('put');
}
