const attendanceService = require('../services/attendance.service');
const asyncHandler = require('../utils/asyncHandler');
const httpStatus = require('../constants/httpStatus');

const createAttendance = asyncHandler(async (req, res) => {
    const record = attendanceService.createAttendance(req.body);
    res.status(httpStatus.CREATED).json({
        success: true,
        data: record
    });
});

const getAllAttendance = asyncHandler(async (req, res) => {
    const { limit, offset, ward, covered, date, q } = req.query;
    const { records, totalDatasetCount } = attendanceService.getAllAttendance({ limit, offset, ward, covered, date, q });
    res.status(httpStatus.OK).json({
        success: true,
        data: records,
        total_dataset_count: totalDatasetCount
    });
});

const getAttendanceById = asyncHandler(async (req, res) => {
    const record = attendanceService.getAttendanceById(req.params.id);
    res.status(httpStatus.OK).json({
        success: true,
        data: record
    });
});

const updateAttendance = asyncHandler(async (req, res) => {
    const record = attendanceService.updateAttendance(req.params.id, req.body);
    res.status(httpStatus.OK).json({
        success: true,
        data: record
    });
});

const deleteAttendance = asyncHandler(async (req, res) => {
    attendanceService.deleteAttendance(req.params.id);
    res.status(httpStatus.OK).json({
        success: true,
        data: { message: 'Attendance record deleted successfully' }
    });
});

module.exports = {
    createAttendance,
    getAllAttendance,
    getAttendanceById,
    updateAttendance,
    deleteAttendance
};
