const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const verifyToken = require('../middleware/authMiddleware');

router.get('/login', verifyToken, authController.login);
router.post('/register', verifyToken, authController.register);

module.exports = router;