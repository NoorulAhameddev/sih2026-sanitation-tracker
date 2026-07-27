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
        
        // Auto-migration: Check if table has new schema columns and drop if legacy
        const tableInfo = db.pragma('table_info(attendance_records)');
        const hasPriorityScore = tableInfo.some(col => col.name === 'priority_score');
        if (tableInfo.length > 0 && !hasPriorityScore) {
            db.exec('DROP TABLE IF EXISTS attendance_records;');
            logger.info('Dropped legacy schema table for migration to Priority Score schema.');
        }

        // Auto-migration: Add phone_number column if table exists but column is missing
        const currentTableInfo = db.pragma('table_info(attendance_records)');
        const hasPhoneNumber = currentTableInfo.some(col => col.name === 'phone_number');
        if (currentTableInfo.length > 0 && !hasPhoneNumber) {
            db.exec("ALTER TABLE attendance_records ADD COLUMN phone_number TEXT DEFAULT '';");
            logger.info('Migrated: Added phone_number column to attendance_records.');
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

        // Ensure concurrency-safe unique index exists (for pre-existing databases)
        try {
            db.exec(`
                CREATE UNIQUE INDEX IF NOT EXISTS idx_unique_worker_route_date
                    ON attendance_records(worker_id, route_id, date)
                    WHERE deleted_at IS NULL;
            `);
        } catch (indexErr) {
            logger.warn('Unique index may already exist or could not be created:', indexErr.message);
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
