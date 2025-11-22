const express = require('express');
const router = express.Router();
const { addPurchase, getPurchases } = require('../controllers/purchaseController');
const { protect, admin } = require('../middleware/authMiddleware');

router.route('/').post(protect, addPurchase).get(protect, getPurchases); // Maybe restrict to admin? Requirement says "Staff ... cannot change settings". Adding purchase updates stock, which staff can do ("update stock"). So protect is fine.

module.exports = router;
