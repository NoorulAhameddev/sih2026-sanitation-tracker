const healthService = require('../services/health.service');
const asyncHandler = require('../utils/asyncHandler');
const httpStatus = require('../constants/httpStatus');
const config = require('../config');

const getHealth = asyncHandler(async (req, res) => {
    const dbStatus = healthService.checkDatabase();
    
    const responseData = {
        status: dbStatus ? 'healthy' : 'degraded',
        database: dbStatus ? 'connected' : 'disconnected',
        uptime: process.uptime(),
        timestamp: new Date().toISOString(),
        environment: config.env
    };
    
    if (!dbStatus) {
        return res.status(httpStatus.INTERNAL_SERVER_ERROR).json({
            success: false,
            data: responseData
        });
    }
    
    return res.status(httpStatus.OK).json({
        success: true,
        data: responseData
    });
});

module.exports = {
    getHealth
};
