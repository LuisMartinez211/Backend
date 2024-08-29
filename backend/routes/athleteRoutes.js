// backend/routes/athleteRoutes.js

const express = require('express');
const { registerAthlete, getAllAthletes } = require('../controllers/athleteController');
const router = express.Router();

// Ruta para inscribir a un atleta
router.post('/register', registerAthlete);

// Ruta para obtener todos los atletas (opcional)
router.get('/', getAllAthletes);

module.exports = router;
