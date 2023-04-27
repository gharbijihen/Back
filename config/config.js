const environment = require("./environment");

module.exports={
    development: {
      username: environment.db.user,
      password: environment.db.password,
      database: environment.db.database,
      host: environment.db.host,
      dialect: 'mysql'
    },
    test: {
      username: "root",
      password: null,
      database: "database_test",
      host: "127.0.0.1",
      dialect: "mysql"
    },
    production: {
      username: "root",
      password: null,
      database: "database_production",
      host: "127.0.0.1",
      dialect: "mysql"
    }
  }

