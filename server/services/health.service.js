const { getDb } = require('../database/db');

const checkDatabase = () => {
    try {
        const db = getDb();
        const row = db.prepare('SELECT 1 as result').get();
        return row.result === 1;
    } catch (error) {
        return false;
    }
};

module.exports = {
    checkDatabase
};
