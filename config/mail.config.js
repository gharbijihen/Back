require('dotenv').config()

module.exports = {
    service: 'gmail',
    // host: process.env.MAIL_HOST,
    // secure: true,
    // port: process.env.MAIL_PORT,
    auth: {
        user: process.env.MAIL_USERNAME,
        pass: process.env.MAIL_PASSWORD,
    },
    // tls: { rejectUnauthorized: false },
}
