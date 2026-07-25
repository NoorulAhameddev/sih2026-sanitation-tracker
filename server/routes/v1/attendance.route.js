const express = require('express');
const attendanceController = require('../../controllers/attendance.controller');
const { validate } = require('../../validators');
const attendanceValidator = require('../../validators/attendance.validator');

const router = express.Router();

router.route('/')
    .post(validate(attendanceValidator.createSchema), attendanceController.createAttendance)
    .get(validate(attendanceValidator.querySchema), attendanceController.getAllAttendance);

router.route('/:id')
    .get(attendanceController.getAttendanceById)
    .put(validate(attendanceValidator.updateSchema), attendanceController.updateAttendance)
    .delete(attendanceController.deleteAttendance);

module.exports = router;
