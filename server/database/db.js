const Database = require('better-sqlite3');
const fs = require('fs');
const path = require('path');
const logger = require('../utils/logger');
const config = require('../config');
const { seed } = require('./seed');

let db;

const initDb = () => {
    const dbPath = config.dbPath;
    const dir = path.dirname(dbPath);
    if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, { recursive: true });
    }

    try {
        db = new Database(dbPath);
        logger.info(`Connected to SQLite database at ${dbPath}`);
        
        // Auto-migration: Check if table has new schema columns (e.g. priority_score) and drop if legacy
        const tableInfo = db.pragma('table_info(attendance_records)');
        const hasPriorityScore = tableInfo.some(col => col.name === 'priority_score');
        if (tableInfo.length > 0 && !hasPriorityScore) {
            db.exec('DROP TABLE IF EXISTS attendance_records;');
            logger.info('Dropped legacy schema table for migration to Priority Score schema.');
        }

        // Execute schema.sql
        const schemaPath = path.join(__dirname, 'schema.sql');
        if (fs.existsSync(schemaPath)) {
            const schema = fs.readFileSync(schemaPath, 'utf8');
            db.exec(schema);
            logger.info('Schema executed successfully.');
        } else {
            logger.warn(`Schema file not found at ${schemaPath}`);
        }

        // Automatically seed database with 40 sample records
        seed(db);

    } catch (error) {
        logger.error('Failed to connect to database or execute schema:', error);
        process.exit(1);
    }
};

const getDb = () => {
    if (!db) {
        throw new Error('Database not initialized. Call initDb first.');
    }
    return db;
};

const closeDb = () => {
    if (db) {
        db.close();
        logger.info('SQLite database connection closed.');
    }
};

module.exports = {
    initDb,
    getDb,
    closeDb
};
