import Joi from 'joi';

import { castMembersRoles } from '../constants';

export class CastMemberGuard {
    private static castMemberValidator = Joi.object({
        name: Joi.string()
            .trim()
            .alphanum()
            .min(3)
            .max(20)
            .alter({
                post: (schema) => schema.required(),
            }),
        role: Joi.number()
            .allow(...Object.values(castMembersRoles))
            .alter({
                post: (schema) => schema.default(castMembersRoles.ACTOR),
            }),
        age: Joi.number()
            .min(6)
            .max(99)
            .alter({
                post: (schema) => schema.required(),
            }),
    }).min(1);

    public static createCastMemberValidator =
        CastMemberGuard.castMemberValidator.tailor('post');
    public static updateCastMemberValidator =
        CastMemberGuard.castMemberValidator.tailor('put');
}
