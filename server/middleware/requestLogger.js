const logger = require('../utils/logger');

const requestLogger = (req, res, next) => {
    const start = Date.now();
    
    res.on('finish', () => {
        const duration = Date.now() - start;
        const timestamp = new Date().toISOString().replace('T', ' ').substring(0, 19);
        logger.info(
            `\n[${timestamp}]\n${req.method} ${req.originalUrl}\n${res.statusCode}\n${duration} ms\n${req.ip}`
        );
    });
    
    next();
};

module.exports = requestLogger;
