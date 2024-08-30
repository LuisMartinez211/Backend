// backend/routes/timeRoutes.js

const express = require('express');
const { registerTime, getTimesByCategory, getOverallWinners, validateTimeRecord } = require('../controllers/timeController');
const { protect, authorize } = require('../middleware/authMiddleware');

const router = express.Router();

// Ruta para registrar el tiempo de un atleta (Acceso: solo admin)
router.post('/register', protect, authorize('admin'), validateTimeRecord, registerTime);

// Ruta para obtener los tiempos por categoría (Acceso: público)
router.get('/category/:category', getTimesByCategory);

// Ruta para obtener los ganadores generales (Acceso: público)
router.get('/winners', getOverallWinners);

module.exports = router;
