const express = require('express');
const router = express.Router();
const reportController = require('../controllers/report.controller');

// GET /api/reports/monthly
router.get('/monthly', reportController.monthlyReport);

module.exports = router;