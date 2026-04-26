const express = require('express');
const router = express.Router();
const { body } = require('express-validator');
const authController = require('../controllers/auth.controller');
const { authenticate } = require('../middleware/auth.middleware');

router.post('/register', [
    body('username').isLength({ min: 3 }).trim(),
    body('email').isEmail().normalizeEmail(),
    body('password').isLength({ min: 6 })
], authController.register);

router.post('/login', [
    body('email').isEmail().normalizeEmail(),
    body('password').notEmpty()
], authController.login);

router.get('/profile', authenticate, authController.getProfile);

module.exports = router;