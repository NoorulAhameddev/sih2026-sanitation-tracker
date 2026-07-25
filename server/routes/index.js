const express = require('express');
const v1Routes = require('./v1');

const router = express.Router();

router.get('/health', (req, res) => {
    res.status(200).json({
        success: true,
        data: { status: 'healthy', timestamp: new Date().toISOString() }
    });
});

router.use('/api/v1', v1Routes);

module.exports = router;
