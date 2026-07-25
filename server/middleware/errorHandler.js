const logger = require('../utils/logger');
const httpStatus = require('../constants/httpStatus');
const config = require('../config');

const errorHandler = (err, req, res, next) => {
    const statusCode = err.statusCode || httpStatus.INTERNAL_SERVER_ERROR;
    const message = err.message || 'Internal Server Error';
    const code = err.code || 'INTERNAL_ERROR';

    // Log the error
    if (statusCode >= 500) {
        logger.error(`[Error] ${statusCode} - ${message} - ${req.originalUrl} - ${req.method} - ${req.ip}`);
        if (config.env !== 'production') {
            logger.error(err.stack);
        }
    } else {
        logger.warn(`[Client Error] ${statusCode} - ${message} - ${req.originalUrl} - ${req.method} - ${req.ip}`);
    }

    res.status(statusCode).json({
        success: false,
        error: {
            code,
            message,
            ...(config.env !== 'production' && { stack: err.stack })
        }
    });
};

module.exports = errorHandler;
