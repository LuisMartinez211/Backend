// backend/models/User.js

const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
    username: {
        type: String,
        required: [true, 'El nombre de usuario es obligatorio'],
        unique: true,
        trim: true,
        maxlength: [50, 'El nombre de usuario no puede exceder los 50 caracteres'],
    },
    email: {
        type: String,
        required: [true, 'El correo electrónico es obligatorio'],
        unique: true,
        trim: true,
        lowercase: true,
        match: [/\S+@\S+\.\S+/, 'El correo electrónico no es válido'],
    },
    password: {
        type: String,
        required: [true, 'La contraseña es obligatoria'],
        minlength: [6, 'La contraseña debe tener al menos 6 caracteres'],
    },
    role: {
        type: String,
        enum: ['admin', 'participant'],
        default: 'participant',
    },
}, {
    timestamps: true,
});

// Encriptar el password antes de guardar el usuario
userSchema.pre('save', async function (next) {
    if (!this.isModified('password')) {
        return next();
    }
    try {
        const salt = await bcrypt.genSalt(10);
        this.password = await bcrypt.hash(this.password, salt);
        next();
    } catch (error) {
        next(error);
    }
});

// Normalizar datos antes de guardar
userSchema.pre('save', function (next) {
    if (this.isModified('username')) {
        this.username = this.username.trim().toLowerCase();
    }
    if (this.isModified('email')) {
        this.email = this.email.trim().toLowerCase();
    }
    next();
});

// Comparar passwords para la autenticación
userSchema.methods.matchPassword = async function (enteredPassword) {
    return await bcrypt.compare(enteredPassword, this.password);
};

// Manejo de errores de MongoDB
userSchema.post('save', function(error, doc, next) {
    if (error.name === 'MongoError' && error.code === 11000) {
        next(new Error('El correo electrónico o nombre de usuario ya están en uso'));
    } else {
        next(error);
    }
});

// Índices para optimizar consultas
userSchema.index({ email: 1 });
userSchema.index({ username: 1 });

const User = mongoose.model('User', userSchema);

module.exports = User;
