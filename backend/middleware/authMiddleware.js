// backend/middleware/authMiddleware.js

const jwt = require('jsonwebtoken');
const User = require('../models/User');

// Middleware para proteger rutas
const protect = async (req, res, next) => {
    let token;

    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
        try {
            // Obtener el token del header
            token = req.headers.authorization.split(' ')[1];
            console.log('Token recibido:', token);

            // Verificar el token
            const decoded = jwt.verify(token, process.env.JWT_SECRET);

            // Obtener el usuario del token
            req.user = await User.findById(decoded.id).select('-password');

            // Si el usuario no se encuentra, devolver error
            if (!req.user) {
                return res.status(401).json({ success: false, message: 'No autorizado, usuario no encontrado' });
            }

            next();
        } catch (error) {
            // Manejo de errores para token expirado o inválido
            if (error.name === 'TokenExpiredError') {
                return res.status(401).json({ success: false, message: 'El token ha expirado, por favor inicia sesión de nuevo' });
            } else if (error.name === 'JsonWebTokenError') {
                return res.status(401).json({ success: false, message: 'No autorizado, token inválido' });
            } else {
                console.error('Error en la verificación del token:', error);
                return res.status(500).json({ success: false, message: 'Error en el servidor', error: error.message });
            }
        }
    }

    if (!token) {
        return res.status(401).json({ success: false, message: 'No autorizado, no se encontró un token' });
    }
};

// Middleware para verificar roles
const authorize = (...roles) => {
    return (req, res, next) => {
        if (!roles.includes(req.user.role)) {
            return res.status(403).json({ success: false, message: 'No tienes permiso para acceder a esta ruta' });
        }
        next();
    };
};

module.exports = { protect, authorize };
