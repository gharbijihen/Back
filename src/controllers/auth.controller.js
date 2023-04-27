// modules
const httpStatus = require('http-status')

const jwt = require('jsonwebtoken')
const bcrypt = require('bcrypt')
const crypto = require('crypto')

// services
const AuthServices = require('../services/auth.service')

// helpers
const APIError = require('../helpers/apiError.helper')
const HttpError = require('../middlewares/http-error')

const customErrors = require('../helpers/customerErrors.helper')
const mailer = require('../extensions/mailer.middleware')

const db = require('../models')
const User = db.User
const ResetPswd = db.ResetPassword

//lodah
var _ = require('lodash')

/**
 * Class representing all AuthController's functions
 */

module.exports = class AuthController {
    // create user
    static async create(req, res, next) {
        try {
            const data = req.body
            const token = crypto.randomBytes(20).toString('hex')
            data.confirmation_token = token
            const result = await AuthServices.create(data, res)
            mailer.sendVerificationAccountMail(result)

            return res.success(result)
        } catch (err) {
            return next(err)
        }
    }
    static async login(req, res, next) {
        try {
            const data = req.body
            const result = await AuthServices.login(data, res)

            return result
        } catch (err) {
            return next(err)
        }
    }
    static async confirmEmail(req, res, next) {
        try {
            const { userId } = req.query
            const id = userId.split('-')[0]
            const token = userId.split('-')[1]
            const existingUser = await User.findByPk(id)

            if (!existingUser)
                return res
                    .status(404)
                    .send({ status: 'error', message: 'User is not found' })
            if (existingUser.confirmation_token !== token)
                return res
                    .status(404)
                    .send({ status: 'error', message: 'invalid token' })

            if (existingUser.confirmedEmail)
                return res.send({
                    status: 'success',
                    message: 'User Account already confirmed ',
                })

            await User.update(
                {
                    confirmedEmail: true,
                },
                {
                    where: { id: id },
                    where: { confirmation_token: token },
                }
            )

            const updatedUser = await User.findByPk(id)

            if (!updatedUser) {
                return res.status(403).send({
                    status: 'error',
                    message: 'User status did not confirmed',
                })
            } else {
                res.status(200).json({
                    status: 'success',
                    data: updatedUser,
                    message: 'User confirmed successfully ',
                })
            }
        } catch (error) {
            return next(new HttpError('Something went wrong'), 500)
        }
    }
    static async resetPassword(req, res, next) {
        try {
            let existingUser
            const { email } = req.body

            if (!email)
                return res
                    .status(401)
                    .send({ status: 'error', message: 'Email is required' })

            existingUser = await User.findOne({
                where: {
                    email: email,
                },
            })

            if (!existingUser)
                return res
                    .status(404)
                    .send({ status: 'error', message: 'User is not found' })

            ResetPswd.destroy({
                where: {
                    userId: existingUser.id,
                },
            })

            let generatedToken = await new Promise((resolve, reject) => {
                crypto.randomBytes(32, (ex, buf) => {
                    if (ex) reject('Something went wrong')
                    resolve(buf.toString('hex'))
                })
            })
            var date = new Date()
            date.setMinutes(date.getMinutes() + 10)

            const resetPswd = new ResetPswd({
                token: crypto
                    .createHash('sha256')
                    .update(generatedToken)
                    .digest('hex'),
                expirationDate: date,
                userId: existingUser.id,
            })

            await resetPswd.save()

            mailer.sendResetPasswordMail(generatedToken, existingUser) // here we will send the email to the user

            return res.status(200).json({
                status: 'success',
                message: 'Reset password link is sent',
            })
        } catch (error) {
            return next(new HttpError('Something went wrong'), 500)
        }
    }

    static async changePassword(req, res, next) {
        try {
            let existingUser
            const { newPassword, confirmNewPassword } = req.body
            const { token, userId } = req.query
            if (!token)
                return res.status(401).send({
                    status: 'error',
                    message: 'Reset token is missing',
                })

            existingUser = await User.findByPk(userId)

            if (!existingUser)
                return res
                    .status(404)
                    .send({ status: 'error', message: 'User is not found' })

            if (!newPassword || !confirmNewPassword)
                return res
                    .status(400)
                    .send({ status: 'error', message: 'Missing fields' })

            let resetPswd = await ResetPswd.findOne({
                where: {
                    userId: existingUser.id,
                },
            })
            if (
                !(
                    resetPswd.token ===
                    crypto.createHash('sha256').update(token).digest('hex')
                ) ||
                resetPswd.expirationDate <= new Date()
            ) {
                return res.status(401).send({
                    status: 'error',
                    message: 'Tokens does not match or expired',
                })
            }

            if (newPassword !== confirmNewPassword)
                return res.status(403).send({
                    status: 'error',
                    message: 'Password and Confirm Password must be match',
                })

            let hashedPassword

            hashedPassword = await bcrypt.hash(newPassword, 12)

            await User.update(
                {
                    password: hashedPassword,
                },
                {
                    where: { id: existingUser.id },
                }
            )

            ResetPswd.destroy({
                where: {
                    id: resetPswd.id,
                },
            })
            return res.status(200).json({
                status: 'success',
                message: 'Password changed successfully',
            })
        } catch (error) {
            return next(new HttpError('Something went wrong'), 500)
        }
    }
}
