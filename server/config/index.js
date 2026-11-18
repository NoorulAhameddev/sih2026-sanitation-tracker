require('dotenv').config();

const config = {
    env: process.env.NODE_ENV || 'development',
    port: parseInt(process.env.PORT, 10) || 3000,
    dbPath: process.env.DB_PATH || './database/app.db',
};

// Validate required environment variables
const requiredConfig = [
    { key: 'dbPath', env: 'DB_PATH' }
];

for (const req of requiredConfig) {
    if (!config[req.key]) {
        console.error(`[ERROR] Missing required environment variable: ${req.env}`);
        process.exit(1);
    }
}

module.exports = config;
