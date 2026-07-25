const { getDb } = require('../database/db');

class AttendanceRepository {
    create(data) {
        const db = getDb();
        const insert = db.transaction((attendanceData) => {
            const stmt = db.prepare(`
                INSERT INTO attendance_records (date, worker_id, worker_name, route_id, ward, covered, complaints_received, priority_score, remarks)
                VALUES (@date, @worker_id, @worker_name, @route_id, @ward, @covered, @complaints_received, @priority_score, @remarks)
            `);
            const info = stmt.run({
                date: attendanceData.date,
                worker_id: attendanceData.worker_id,
                worker_name: attendanceData.worker_name,
                route_id: attendanceData.route_id,
                ward: attendanceData.ward,
                covered: attendanceData.covered,
                complaints_received: attendanceData.complaints_received || 0,
                priority_score: attendanceData.priority_score || 0,
                remarks: attendanceData.remarks || ''
            });
            return { id: info.lastInsertRowid, ...attendanceData };
        });
        return insert(data);
    }

    findAll(options = {}) {
        const db = getDb();
        const { limit = 100, offset = 0, ward, covered, date, q } = options;
        
        let query = 'SELECT * FROM attendance_records WHERE deleted_at IS NULL';
        const params = {};

        if (ward) {
            query += ' AND ward = @ward';
            params.ward = ward;
        }
        if (covered) {
            query += ' AND covered = @covered';
            params.covered = covered;
        }
        if (date) {
            query += ' AND date = @date';
            params.date = date;
        }
        if (q) {
            query += ' AND (worker_name LIKE @q OR worker_id LIKE @q OR route_id LIKE @q OR ward LIKE @q)';
            params.q = `%${q}%`;
        }

        const totalQuery = db.prepare('SELECT COUNT(*) as count FROM attendance_records WHERE deleted_at IS NULL').get();
        const totalDatasetCount = totalQuery.count;

        // Priority Ordering ("Whatever needs attention appears first")
        // Sorted by priority_score descending, then date
        query += " ORDER BY priority_score DESC, date DESC LIMIT @limit OFFSET @offset";
        params.limit = parseInt(limit, 10);
        params.offset = parseInt(offset, 10);

        const records = db.prepare(query).all(params);
        return { records, totalDatasetCount };
    }

    findById(id) {
        const db = getDb();
        return db.prepare('SELECT * FROM attendance_records WHERE id = ? AND deleted_at IS NULL').get(id);
    }

    findByDetails(worker_id, route_id, date) {
        const db = getDb();
        return db.prepare(`
            SELECT * FROM attendance_records 
            WHERE worker_id = ? AND route_id = ? AND date = ? AND deleted_at IS NULL
        `).get(worker_id, route_id, date);
    }

    update(id, data) {
        const db = getDb();
        const updateTx = db.transaction((updateData, recordId) => {
            const fields = Object.keys(updateData).map(key => `${key} = @${key}`).join(', ');
            const stmt = db.prepare(`UPDATE attendance_records SET ${fields} WHERE id = @id AND deleted_at IS NULL`);
            stmt.run({ ...updateData, id: recordId });
            return this.findById(recordId);
        });
        return updateTx(data, id);
    }

    delete(id) {
        const db = getDb();
        const deleteTx = db.transaction((recordId) => {
            const stmt = db.prepare('UPDATE attendance_records SET deleted_at = CURRENT_TIMESTAMP WHERE id = ?');
            stmt.run(recordId);
            return true;
        });
        return deleteTx(id);
    }
}

module.exports = new AttendanceRepository();
