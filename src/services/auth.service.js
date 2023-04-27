// models
const db = require('../models')
const User = db.User
const jwt = require('jsonwebtoken')
const bcrypt = require('bcrypt')

/**
 * Class representing auth services
 */
module.exports = class AuthServices {
    /**
     * create
     */
    static async create(data, res) {
        const result = await User.create(data)
        return result
        // }
    }
    /**
     * login
     */
    static async login(data, res) {
        try {
            const user = await User.findOne({ where: { email: data.email } })
            if (!user) {
                return res
                    .status(401)
                    .send({ message: 'Email or mot de passe invalid' })
            }
            const isMatch = await bcrypt.compare(data.password, user.password)
            if (!isMatch) {
                return res
                    .status(401)
                    .send({ message: 'Email or mot de passe invalid' })
            }
            if (user.confirmedEmail !== true) {
                return res.status(401).send({
                    message: 'Confirmer votre email avant de connecter',
                })
            }
            const token = jwt.sign({ id: user.id }, process.env.SECRET)
            return res.success({ token: token, user: user })
            // return { token }
        } catch (err) {
            console.error(err)
            return res.status(500).send({ message: 'Internal server error' })
        }
    }
}
