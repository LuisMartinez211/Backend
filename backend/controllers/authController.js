const { check, validationResult } = require('express-validator');
const User = require('../models/User');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

// Generar un token JWT
const generateToken = (id) => {
    return jwt.sign({ id }, process.env.JWT_SECRET, {
        expiresIn: '30d',
    });
};

// Validación de datos de registro
const validateRegister = [
    check('username', 'El nombre de usuario es obligatorio').notEmpty(),
    check('email', 'El correo electrónico no es válido').isEmail(),
    check('password', 'La contraseña debe tener al menos 6 caracteres').isLength({ min: 6 }),
];

// Validación de datos de inicio de sesión
const validateLogin = [
    check('email', 'El correo electrónico es obligatorio').isEmail(),
    check('password', 'La contraseña es obligatoria').exists(),
];

// Registro de usuario
const registerUser = async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ success: false, errors: errors.array() });
    }

    const { username, email, password, role } = req.body;

    try {
        // Verificar si el usuario ya existe
        const userExists = await User.findOne({ email });
        if (userExists) {
            return res.status(400).json({ success: false, message: 'El usuario ya existe' });
        }

        // Crear un nuevo usuario
        const user = new User({
            username,
            email,
            password,
            role  // Asegurarse de que se establezca el rol que se pasa en la solicitud
        });

        // Encriptar la contraseña antes de guardar
        const salt = await bcrypt.genSalt(10);
        user.password = await bcrypt.hash(password, salt);
        await user.save();

        // Enviar la respuesta con el token JWT
        res.status(201).json({
            success: true,
            data: {
                _id: user._id,
                username: user.username,
                email: user.email,
                role: user.role,
                token: generateToken(user._id),
            }
        });
    } catch (error) {
        console.error('Error en registerUser:', error);
        res.status(500).json({ success: false, message: 'Error en el servidor', error: error.message });
    }
};

// Inicio de sesión de usuario
const loginUser = async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ success: false, errors: errors.array() });
    }

    const { email, password } = req.body;

    try {
        // Verificar si el usuario existe
        const user = await User.findOne({ email });

        // Verifica que el usuario existe y que la contraseña es correcta
        if (user && (await user.matchPassword(password))) {
            // Enviar la respuesta con el token JWT
            res.json({
                success: true,
                data: {
                    _id: user._id,
                    username: user.username,
                    email: user.email,
                    role: user.role,
                    token: generateToken(user._id),
                }
            });
        } else {
            res.status(401).json({ success: false, message: 'Credenciales inválidas' });
        }
    } catch (error) {
        console.error('Error en loginUser:', error);
        res.status(500).json({ success: false, message: 'Error en el servidor', error: error.message });
    }
};

module.exports = {
    registerUser,
    loginUser,
    validateRegister,
    validateLogin,
};
