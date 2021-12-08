import Joi from 'joi';

export class GenericGuard {
    public static idValidator = Joi.object({
        id: Joi.string().trim().min(1).required(),
    });
}
