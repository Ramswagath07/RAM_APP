const express = require('express');
const router = express.Router();
const { loginUser, registerUser } = require('../controllers/authController');
const { protect, admin } = require('../middleware/authMiddleware');

router.post('/login', loginUser);
router.post('/register', registerUser); // In production, protect this route with admin middleware

module.exports = router;
