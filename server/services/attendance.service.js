const attendanceRepository = require('../repositories/attendance.repository');
const AppError = require('../errors/AppError');
const logger = require('../utils/logger');

class AttendanceService {
    createAttendance(data) {
        const existing = attendanceRepository.findByDetails(data.worker_id, data.route_id, data.date);
        if (existing) {
            throw new AppError('Attendance and route record already exists for this worker, route, and date', 409, 'DUPLICATE_RECORD');
        }
        
        const attendanceDate = new Date(data.date);
        const today = new Date();
        today.setHours(23, 59, 59, 999);
        if (attendanceDate > today) {
            throw new AppError('Attendance date cannot be in the future', 400, 'INVALID_DATE');
        }

        // Calculate Priority Score
        const covered = data.covered;
        const complaints = parseInt(data.complaints_received) || 0;
        data.priority_score = (covered === 'No' ? 10000 : 0) + complaints;

        // The repository.create() call is now concurrency-safe:
        // If two requests pass the findByDetails() check above simultaneously,
        // the UNIQUE database index ensures only one INSERT succeeds.
        // The other throws CONCURRENT_DUPLICATE (409), which propagates to the client.
        const record = attendanceRepository.create(data);
        logger.info(`Route Attendance Created\nWorker: ${record.worker_id}\nRoute: ${record.route_id}\nDate: ${record.date}`);
        return record;
    }

    getAllAttendance(options) {
        return attendanceRepository.findAll(options);
    }

    getAttendanceById(id) {
        const record = attendanceRepository.findById(id);
        if (!record) {
            throw new AppError('Attendance record not found', 404, 'NOT_FOUND');
        }
        return record;
    }

    updateAttendance(id, data) {
        const existingRecord = this.getAttendanceById(id);
        
        // Recalculate priority score if covered or complaints changed
        const covered = data.covered !== undefined ? data.covered : existingRecord.covered;
        const complaints = data.complaints_received !== undefined ? parseInt(data.complaints_received) : existingRecord.complaints_received;
        data.priority_score = (covered === 'No' ? 10000 : 0) + complaints;

        const record = attendanceRepository.update(id, data);
        logger.info(`Attendance Updated\nID: ${id}`);
        return record;
    }

    deleteAttendance(id) {
        this.getAttendanceById(id);
        attendanceRepository.delete(id);
        logger.info(`Attendance Soft Deleted\nID: ${id}`);
        return true;
    }
}

module.exports = new AttendanceService();
