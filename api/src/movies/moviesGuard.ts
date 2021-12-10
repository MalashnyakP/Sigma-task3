import Joi from 'joi';

import { movieMaturityLevels, utils } from '../constants';

const { RUNTIME_REGEX } = utils;

export class MoviesGuard {
    private static staffSchema = Joi.string().trim().min(3).max(30);

    private static movieValidator = Joi.object({
        id: Joi.string()
            .trim()
            .alter({
                post: (schema) => schema.required(),
                put: (schema) => schema.forbidden(),
            }),
        title: Joi.string()
            .trim()
            .min(4)
            .max(30)
            .alter({
                post: (schema) => schema.required(),
            }),
        description: Joi.string()
            .trim()
            .min(4)
            .max(30)
            .alter({
                post: (schema) => schema.required(),
            }),
        year: Joi.number()
            .min(1000)
            .max(9999)
            .alter({
                post: (schema) => schema.required(),
            }),
        maturity: Joi.string()
            .trim()
            .allow(...Object.values(movieMaturityLevels))
            .alter({
                post: (schema) => schema.required(),
            }),
        runtime: Joi.string()
            .trim()
            .regex(RUNTIME_REGEX)
            .alter({
                post: (schema) => schema.required(),
            }),
        genre: Joi.string()
            .trim()
            .alter({
                post: (schema) => schema.required(),
            }),
        cast: Joi.array()
            .min(2)
            .items(MoviesGuard.staffSchema)
            .alter({
                post: (schema) => schema.required(),
            }),
        director: MoviesGuard.staffSchema.alter({
            post: (schema) => schema.required(),
        }),
        logo: Joi.string()
            .trim()
            .alter({
                post: (schema) => schema.required(),
            }),
        backgroundImg: Joi.string()
            .trim()
            .alter({
                post: (schema) => schema.required(),
            }),
    }).min(1);

    public static createMovieValidator =
        MoviesGuard.movieValidator.tailor('post');
    public static updateMovieValidator =
        MoviesGuard.movieValidator.tailor('put');
}
