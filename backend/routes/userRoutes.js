// backend/routes/userRoutes.js

const express = require('express');
const { protect, authorize } = require('../middleware/authMiddleware');
const { getUsers } = require('../controllers/userController');

const router = express.Router();

// Ruta para obtener todos los usuarios (solo accesible por administradores)
router.get('/users', protect, authorize('admin'), getUsers);

module.exports = router;
