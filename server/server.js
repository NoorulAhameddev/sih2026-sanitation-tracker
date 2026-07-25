const express = require('express');
const helmet = require('helmet');
const cors = require('cors');
const compression = require('compression');

// 1. Load Config
const config = require('./config');
const logger = require('./utils/logger');

// 2. Connect SQLite & 3. Execute schema.sql
const { initDb, closeDb } = require('./database/db');
initDb();

// 4. Initialize Express
const app = express();

const requestLogger = require('./middleware/requestLogger');
const errorHandler = require('./middleware/errorHandler');
const routes = require('./routes');
const httpStatus = require('./constants/httpStatus');

// Security and utility middleware
const rateLimit = require('express-rate-limit');
const limiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    limit: 500, // Limit each IP to 500 requests per window
    standardHeaders: 'draft-7',
    legacyHeaders: false,
});

// 5. Register Middleware
app.use(helmet());
app.use(cors());
app.use(compression());
app.use(limiter);
app.use(express.json({ limit: '1mb' }));
app.use(express.urlencoded({ extended: true, limit: '1mb' }));
app.use(requestLogger);

// 6. Register Routes
app.use('/', routes);

// 404 handler
app.use((req, res, next) => {
    res.status(httpStatus.NOT_FOUND).json({
        success: false,
        error: {
            code: 'NOT_FOUND',
            message: 'Resource not found'
        }
    });
});

// 7. Error Handler
app.use(errorHandler);

// 8. app.listen() (Only listen if not running inside test environment)
let server;
if (process.env.NODE_ENV !== 'test') {
    server = app.listen(config.port, () => {
        logger.info(`Server is running in ${config.env} mode on port ${config.port}`);
    });

    const gracefulShutdown = (signal) => {
        logger.info(`\n${signal} received. Shutting down gracefully...`);
        server.close(() => {
            logger.info('HTTP server closed (stopped accepting new connections).');
            try {
                closeDb();
                process.exit(0);
            } catch (err) {
                logger.error('Error during database close:', err);
                process.exit(1);
            }
        });
    };

    process.on('SIGINT', () => gracefulShutdown('SIGINT'));
    process.on('SIGTERM', () => gracefulShutdown('SIGTERM'));
}

module.exports = app;
