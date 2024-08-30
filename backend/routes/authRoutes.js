// backend/routes/authRoutes.js

const express = require('express');
const rateLimit = require('express-rate-limit');
const { registerUser, loginUser, validateRegister, validateLogin } = require('../controllers/authController.js');

const router = express.Router();

// Límite de solicitudes (Rate Limiting)
const authLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutos
    max: 100, // Limita a 100 solicitudes por IP
    message: 'Demasiadas solicitudes desde esta IP, por favor intente de nuevo más tarde'
});

// Ruta para registrar un nuevo usuario
router.post('/register', authLimiter, validateRegister, registerUser);

// Ruta para iniciar sesión
router.post('/login', authLimiter, validateLogin, loginUser);

module.exports = router;
