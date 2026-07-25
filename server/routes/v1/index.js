const express = require('express');
const healthRoute = require('./health.route');
const attendanceRoute = require('./attendance.route');

const router = express.Router();

router.use('/health', healthRoute);
router.use('/attendance', attendanceRoute);

module.exports = router;
