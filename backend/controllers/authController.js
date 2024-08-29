// backend/controllers/authController.js

const User = require('../models/User');
const jwt = require('jsonwebtoken');

// Generar un token JWT
const generateToken = (id) => {
    return jwt.sign({ id }, process.env.JWT_SECRET, {
        expiresIn: '30d',
    });
};

/// Registro de usuario
const registerUser = async (req, res) => {
    const { username, email, password, role } = req.body;

    try {
        // Verificar si el usuario ya existe
        const userExists = await User.findOne({ email });
        if (userExists) {
            return res.status(400).json({ message: 'Usuario ya existe' });
        }

        // Crear un nuevo usuario
        const user = await User.create({
            username,
            email,
            password,
            role  // Asegurarse de que se establezca el rol que se pasa en la solicitud
        });

        // Enviar la respuesta con el token JWT
        res.status(201).json({
            _id: user._id,
            username: user.username,
            email: user.email,
            role: user.role,
            token: generateToken(user._id),
        });
    } catch (error) {
        res.status(500).json({ message: 'Error en el servidor', error });
    }
};

// Inicio de sesión de usuario
const loginUser = async (req, res) => {
    const { email, password } = req.body;

    try {
        // Verificar si el usuario existe
        const user = await User.findOne({ email });

        if (user && (await user.matchPassword(password))) {
            // Enviar la respuesta con el token JWT
            res.json({
                _id: user._id,
                username: user.username,
                email: user.email,
                role: user.role,
                token: generateToken(user._id),
            });
        } else {
            res.status(401).json({ message: 'Credenciales inválidas' });
        }
    } catch (error) {
        res.status(500).json({ message: 'Error en el servidor', error });
    }
};

module.exports = {
    registerUser,
    loginUser,
};
