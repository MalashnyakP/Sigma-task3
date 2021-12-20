import Joi from 'joi';

import { utils } from './constants';

export class GenericGuard {
    public static idValidator = Joi.object({
        id: Joi.string().trim().regex(utils.MONGO_DB_ID_REGEX).required(),
    });
}
