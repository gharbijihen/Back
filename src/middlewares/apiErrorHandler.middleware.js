// helpers
const APIError = require("../helpers/apiError.helper.js");

/**
 * middleware  convert Error to APIError
 */
const errorConverter = (err, req, res, next) => {
    let error = err;

    if (!(error instanceof APIError)) {
        let status;
        if (error.statusCode) {
            status = error.statusCode;
        }
        let msg;
        if (error.message && !error.details) {
            msg = error.message || httpStatus[statusCode];
        }
        // body
        else if (error.details.body) {
            msg = error.details.body[0].message;
        }
        // params
        else if (error.details.params) {
            msg = error.details.params[0].message;
        }
        // query
        else {
            msg = error.details.query[0].message;
        }
        error = new APIError({ message: msg }, status);
    }
    next(error);
};

/**
 * middleware : response with  APIError
 */
const handleError = (err, req, res, next) => {
    const { status, message } = err;
    res.status(status).json({
        ...err,
        message,
    });
};

module.exports = { errorConverter, handleError };
 