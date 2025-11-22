const express = require('express');
const router = express.Router();
const { getDashboardStats, getChartsData } = require('../controllers/analyticsController');
const { protect } = require('../middleware/authMiddleware');

router.get('/dashboard', protect, getDashboardStats);
router.get('/charts', protect, getChartsData);

module.exports = router;
