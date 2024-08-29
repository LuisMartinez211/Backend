// backend/routes/timeRoutes.js

const express = require('express');
const { registerTime, getTimesByCategory, getOverallWinners } = require('../controllers/timeController');
const router = express.Router();

// Ruta para registrar el tiempo de un atleta
router.post('/register', registerTime);

// Ruta para obtener los tiempos por categoría
router.get('/category/:category', getTimesByCategory);

// Ruta para obtener los ganadores generales
router.get('/winners', getOverallWinners);

module.exports = router;
