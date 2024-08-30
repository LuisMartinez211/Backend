// backend/routes/userRoutes.js

const express = require('express');
const { protect, authorize } = require('../middleware/authMiddleware');
const { getUsers, updateUser, deleteUser } = require('../controllers/userController');

const router = express.Router();

// Ruta para obtener todos los usuarios (solo accesible por administradores)
router.get('/users', protect, authorize('admin'), getUsers);

// Ruta para actualizar un usuario (solo accesible por administradores)
router.put('/users/:id', protect, authorize('admin'), updateUser);

// Ruta para eliminar un usuario (solo accesible por administradores)
router.delete('/users/:id', protect, authorize('admin'), deleteUser);

module.exports = router;
