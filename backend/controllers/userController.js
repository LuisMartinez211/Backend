// backend/controllers/userController.js

const User = require('../models/User');

// Obtener todos los usuarios (solo para administradores)
const getUsers = async (req, res) => {
    try {
        const users = await User.find().select('-password');
        if (!users) {
            return res.status(404).json({ message: 'No se encontraron usuarios' });
        }
        res.status(200).json(users);  // Asegúrate de devolver la respuesta en JSON
    } catch (error) {
        console.error('Error en getUsers:', error);
        res.status(500).json({ message: 'Error en el servidor', error: error.message });
    }
};

module.exports = { getUsers };
