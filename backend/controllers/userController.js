// backend/controllers/userController.js

const User = require('../models/User');

// Obtener todos los usuarios (solo para administradores)
const getUsers = async (req, res) => {
    const { page = 1, limit = 10, role, search } = req.query;

    try {
        // Construir filtros dinámicamente
        const filters = {};
        if (role) filters.role = role;
        if (search) filters.username = { $regex: search, $options: 'i' };

        // Obtener usuarios con filtros, paginación y exclusión de la contraseña
        const users = await User.find(filters)
            .select('-password')
            .skip((page - 1) * limit)
            .limit(Number(limit));

        if (users.length === 0) {
            return res.status(404).json({ success: false, message: 'No se encontraron usuarios' });
        }

        res.status(200).json({ success: true, data: users });
    } catch (error) {
        console.error('Error en getUsers:', error);
        res.status(500).json({ success: false, message: 'Error en el servidor', error: error.message });
    }
};

// Actualizar un usuario (solo para administradores)
const updateUser = async (req, res) => {
    const { id } = req.params;
    const { username, email, role } = req.body;

    try {
        const user = await User.findById(id);
        if (!user) {
            return res.status(404).json({ success: false, message: 'Usuario no encontrado' });
        }

        // Actualizar campos
        user.username = username || user.username;
        user.email = email || user.email;
        user.role = role || user.role;

        await user.save();

        res.status(200).json({ success: true, data: user });
    } catch (error) {
        console.error('Error en updateUser:', error);
        res.status(500).json({ success: false, message: 'Error en el servidor', error: error.message });
    }
};

// Eliminar un usuario (solo para administradores)
const deleteUser = async (req, res) => {
    const { id } = req.params;

    try {
        const user = await User.findById(id);
        if (!user) {
            return res.status(404).json({ success: false, message: 'Usuario no encontrado' });
        }

        await user.remove();
        res.status(200).json({ success: true, message: 'Usuario eliminado correctamente' });
    } catch (error) {
        console.error('Error en deleteUser:', error);
        res.status(500).json({ success: false, message: 'Error en el servidor', error: error.message });
    }
};

module.exports = { getUsers, updateUser, deleteUser };
