require('dotenv').config()
const nodeMailer = require('nodemailer')
const mailConfig = require('../../config/mail.config')
const transporter = nodeMailer.createTransport(mailConfig)

const sendVerificationAccountMail = async (user) => {
    console.log('user', user)
    const url = `${process.env.APP_FRONT_URL}confirm/${user.id}-${user.confirmation_token}`

    var mailOptions = {
        from: process.env.MAIL_USERNAME,
        to: user.email,
        cc: `${user.userName} <${user.email}>`,
        subject: 'VOLE - Activer votre compte',
        html: `
            <p> Bienvenue  ${user.userName} dans VOLE </p>
            <p> Activer votre compte avec ce lien  <a href="${url}">${url}<a/> </p>
            `,
    }

    transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
            console.log("error", error)
        } else {
            console.log('Email sent: ' + info.response)
        }
    })
}

const sendResetPasswordMail = async (generatedToken, user) => {
    const url = `${process.env.APP_FRONT_URL}changePassword?token=${generatedToken}&userId=${user.id}`

    var mailOptions = {
        from: process.env.MAIL_USERNAME,
        to: user.email,
        cc: `${user.userName} <${user.email}>`,
        subject: 'VOLE - Reset Password',
        html: `
            <p> Bonjour  ${user.userName},  </p>
            <p> Changer votre mot de passe avec ce lien  <a href="${url}">${url}<a/> </p>
            `,
    }

    transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
            console.log(error)
        } else {
            console.log('Email sent: ' + info.response)
        }
    })
}

module.exports = { sendVerificationAccountMail, sendResetPasswordMail }
