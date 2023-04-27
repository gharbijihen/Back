require("dotenv").config();

module.exports = {
    db: {
        database: process.env.DB_NAME,
        user: process.env.DB_USER,
        password: process.env.DB_PASSWORD,
        host: process.env.DB_HOST,
        dialect: 'mysql'
    },
    env: process.env.NODE_ENV,
}