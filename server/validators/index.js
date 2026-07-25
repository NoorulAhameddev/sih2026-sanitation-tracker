const { z } = require('zod');
const httpStatus = require('../constants/httpStatus');

const validate = (schema) => (req, res, next) => {
    try {
        schema.parse({
            body: req.body,
            query: req.query,
            params: req.params,
        });
        next();
    } catch (err) {
        if (err instanceof z.ZodError) {
            return res.status(httpStatus.BAD_REQUEST).json({
                success: false,
                error: {
                    code: 'VALIDATION_ERROR',
                    message: 'Invalid request data',
                    details: err.errors
                }
            });
        }
        next(err);
    }
};

module.exports = { validate };
