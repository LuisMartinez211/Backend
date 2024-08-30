// backend/routes/athleteRoutes.js

const express = require('express');
const { registerAthlete, getAllAthletes, updateAthlete, deleteAthlete, validateAthlete } = require('../controllers/athleteController');
const { protect, authorize } = require('../middleware/authMiddleware');

const router = express.Router();

// Ruta para inscribir a un atleta (Acceso: admin, participant)
router.post('/register', protect, authorize('admin', 'participant'), validateAthlete, registerAthlete);

// Ruta para obtener todos los atletas (Acceso: admin, participant)
router.get('/', protect, authorize('admin', 'participant'), getAllAthletes);

// Ruta para actualizar un atleta (Acceso: admin)
router.put('/:id', protect, authorize('admin'), validateAthlete, updateAthlete);

// Ruta para eliminar un atleta (Acceso: admin)
router.delete('/:id', protect, authorize('admin'), deleteAthlete);

module.exports = router;
