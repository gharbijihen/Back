const route = require('express').Router()

// controller
const authController = require('../controllers/auth.controller')

// middlewares
const AuthValidatorMiddleware = require('../validators/auth.validator')
const {
    checkDuplicateEmail,
    checkMissingFields,
    checkPasswordConfirmation,
} = require('../middlewares/authMiddleware')

// routes

/**
 * @api {post} /
 * @apiName create user
 * @apiGroup users
 * @apiSuccess (200) {Object[]} user data.
 */
route.post(
    '/register',
    [checkMissingFields, checkDuplicateEmail, checkPasswordConfirmation],
    authController.create
)
route.post('/login', AuthValidatorMiddleware.login(), authController.login)

route.post('/confirmEmail', authController.confirmEmail)
route.post("/resetPassword", authController.resetPassword);
route.post("/changePassword", authController.changePassword);

module.exports = route
