const httpStatus = require("http-status");

// helpers
const APIError = require("../helpers/apiError.helper");
const customErrors = require("../helpers/customerErrors.helper")

/**
 * catch 404 error
 */
module.exports = (req, res, next) => {
    next(new APIError(customErrors.HttpErrors.NotFound, httpStatus.NOT_FOUND));
};
