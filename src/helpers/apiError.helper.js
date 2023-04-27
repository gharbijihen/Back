/**
 * Class representing an API error.
 * @extends Error
 */
 class APIError extends Error {
    constructor(error, status = 500) {
        super(error);
        this.name = this.constructor.name;
        this.message = error.message;
        this.errorCode = error.code || status;
        this.status = status;
        Error.captureStackTrace(this, this.constructor.name);
    }
}

module.exports = APIError;
