// modules
const joi = require('joi')
const { validate } = require('express-validation')

/**
 * Class representing all authValidatorMiddleware's functions.
 */
module.exports = class authValidatorMiddleware {
    // Create validation
    static create() {
        return validate({
            body: joi.object({
                firstName: joi.string().required(),
                lastName: joi.string().required(),
                email: joi.string().required(),
                password: joi.string().required(),
                confirmPassword: joi.string().required(),
            }),
        })
    }
    static login() {
        return validate({
            body: joi.object({
                email: joi.string().required(),
                password: joi.string().required(),
            }),
        })
    }
}
