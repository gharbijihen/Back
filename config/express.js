// module
const cookieParser = require('cookie-parser')
const logger = require('morgan')
const helmet = require('helmet')
const cors = require('cors')

// app.js
const app = require('..')

// database
const database = require('./database')

// routes
const routes = require('../src/routes/index.route')

// middlewares
const ResponseMiddleware = require('../src/middlewares/response.middleware')
const routingMiddleware = require('../src/middlewares/routing.middleware')
const {
    errorConverter,
    handleError,
} = require('../src/middlewares/apiErrorHandler.middleware')

// verify database connection
database
    .authenticate()
    .then(() => {
        console.log('Connection has been established successfully.')
    })
    .catch((err) => {
        console.log('Unable to connect to the database:', err)
    })
app.use(cors())
app.use(helmet())
app.use(logger('dev'))
app.use(cookieParser())

// response Middleware
app.use(ResponseMiddleware.setup)

// routes
app.use('/', routes)

// catch 404 and forward to error handler
app.use(routingMiddleware)

// convert Error to ErrorHandler
app.use(errorConverter)

// handle Error
app.use(handleError)

module.exports = app
