import Joi from 'joi';

export const validateObject = (schema: Joi.ObjectSchema<any>, object) => {
    const { value, error } = schema.validate(object);
    return [value, error?.details[0]?.message];
};
