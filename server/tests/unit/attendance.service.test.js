const attendanceService = require('../../services/attendance.service');
const attendanceRepository = require('../../repositories/attendance.repository');
const AppError = require('../../errors/AppError');
const logger = require('../../utils/logger');

describe('AttendanceService Unit Tests', () => {
    beforeEach(() => {
        vi.clearAllMocks();
        vi.spyOn(attendanceRepository, 'findByDetails');
        vi.spyOn(attendanceRepository, 'create');
        vi.spyOn(logger, 'info').mockImplementation(() => {});
    });

    describe('createAttendance', () => {
        it('should throw DUPLICATE_RECORD if route attendance already exists', () => {
            const data = { worker_id: 'WRK-101', route_id: 'RT-01', date: '2026-07-25' };
            attendanceRepository.findByDetails.mockReturnValue({ id: 1, ...data });

            expect(() => attendanceService.createAttendance(data))
                .toThrowError(new AppError('Attendance and route record already exists for this worker, route, and date', 409, 'DUPLICATE_RECORD'));
        });

        it('should throw INVALID_DATE if date is in the future', () => {
            attendanceRepository.findByDetails.mockReturnValue(null);
            
            const futureDate = new Date();
            futureDate.setDate(futureDate.getDate() + 10);
            const data = { worker_id: 'WRK-101', route_id: 'RT-01', date: futureDate.toISOString().split('T')[0] };

            expect(() => attendanceService.createAttendance(data))
                .toThrowError(new AppError('Attendance date cannot be in the future', 400, 'INVALID_DATE'));
        });

        it('should create route attendance successfully', () => {
            attendanceRepository.findByDetails.mockReturnValue(null);
            const data = { worker_id: 'WRK-101', worker_name: 'Test Worker', route_id: 'RT-01', ward: 'Ward-1', covered: 'Yes', complaints_received: 0, date: '2025-01-01', remarks: 'Clear' };
            // The service mutates data by adding priority_score before calling create()
            attendanceRepository.create.mockReturnValue({ id: 1, ...data, priority_score: 0 });

            const result = attendanceService.createAttendance(data);

            expect(result).toEqual({ id: 1, ...data, priority_score: 0 });
            expect(attendanceRepository.create).toHaveBeenCalledWith(data);
            expect(logger.info).toHaveBeenCalled();
        });
    });
});
