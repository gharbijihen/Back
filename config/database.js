const { Sequelize } = require("sequelize");
const environment = require("../config/environment");

const sequelize = new Sequelize(
    environment.db.database,
    environment.db.user,
    environment.db.password,
    {
        host: environment.db.host,
        dialect: 'mysql',
    }
);

module.exports = sequelize;