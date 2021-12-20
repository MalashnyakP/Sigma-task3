import Joi from 'joi';
import { CastMemberGuard } from '../castMembers';

import { genres, movieMaturityLevels, utils } from '../constants';

const { RUNTIME_REGEX, MONGO_DB_ID_REGEX } = utils;

export class MoviesGuard {
    private static staffSchema = Joi.string().trim().regex(MONGO_DB_ID_REGEX);

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
        maturityLevel: Joi.number()
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
        genre: Joi.array()
            .items(Joi.number())
            .allow(...Object.values(genres))
            .unique()
            .alter({
                post: (schema) => schema.required(),
            }),
        cast: Joi.alternatives([
            Joi.array()
                .min(1)
                .items(MoviesGuard.staffSchema)
                .unique()
                .alter({
                    post: (schema) => schema.required(),
                }),
            Joi.array().items(CastMemberGuard.createCastMemberValidator),
        ]),
        director: Joi.alternatives([
            Joi.array()
                .min(1)
                .items(MoviesGuard.staffSchema)
                .unique()
                .alter({
                    post: (schema) => schema.required(),
                }),
            Joi.array().items(CastMemberGuard.createCastMemberValidator),
        ]),
        poster: Joi.string()
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

    public static createMovieValidator = MoviesGuard.movieValidator.tailor('post');
    public static updateMovieValidator = MoviesGuard.movieValidator.tailor('put');
}
