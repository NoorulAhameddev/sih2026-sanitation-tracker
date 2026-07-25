class AppError extends Error {
    constructor(message, statusCode, code) {
        super(message);
        this.statusCode = statusCode;
        this.code = code || 'INTERNAL_ERROR';
        Error.captureStackTrace(this, this.constructor);
    }
}

module.exports = AppError;
