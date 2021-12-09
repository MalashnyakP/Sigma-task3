import Joi from 'joi';

import { movieMaturity, utils } from '../constants';

const { CURR_YEAR, RUNTIME_REGEX } = utils;

export class MoviesGuard {
    private static staffSchema = Joi.string().trim().min(3).max(30);

    public static createMovieValidator = Joi.object({
        id: Joi.string().trim().required(),
        title: Joi.string().trim().min(4).max(30).required(),
        description: Joi.string().trim().min(4).max(30).required(),
        year: Joi.number().min(1950).max(CURR_YEAR).required(),
        maturity: Joi.string()
            .trim()
            .allow(...Object.values(movieMaturity))
            .required(),
        runtime: Joi.string().trim().regex(RUNTIME_REGEX).required(),
        genre: Joi.string().trim().required(),
        cast: Joi.array().min(2).items(MoviesGuard.staffSchema).required(),
        director: MoviesGuard.staffSchema.required(),
        logo: Joi.string().trim().required(),
        backgroundImg: Joi.string().trim().required(),
    });

    public static updateMovieValidator = Joi.object({
        title: Joi.string().trim().min(4).max(30),
        description: Joi.string().trim().min(4).max(30),
        year: Joi.number().min(1950).max(CURR_YEAR),
        maturity: Joi.string()
            .trim()
            .allow(...Object.values(movieMaturity)),
        runtime: Joi.string().trim().regex(RUNTIME_REGEX),
        genre: Joi.string().trim(),
        cast: Joi.array().min(2).items(MoviesGuard.staffSchema),
        director: MoviesGuard.staffSchema,
        logo: Joi.string().trim(),
        backgroundImg: Joi.string().trim(),
    }).min(1);
}
