// backend/models/Athlete.js

const mongoose = require('mongoose');

const athleteSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'El nombre es obligatorio'],
        trim: true,
        maxlength: [50, 'El nombre no puede exceder los 50 caracteres'],
    },
    email: {
        type: String,
        required: [true, 'El correo electrónico es obligatorio'],
        unique: true,
        trim: true,
        lowercase: true,
        match: [/\S+@\S+\.\S+/, 'El correo electrónico no es válido'],
    },
    age: {
        type: Number,
        required: [true, 'La edad es obligatoria'],
        min: [0, 'La edad debe ser un número positivo'],
        max: [120, 'La edad no puede exceder los 120 años'],
    },
    gender: {
        type: String,
        enum: ['male', 'female'],
        required: [true, 'El género es obligatorio'],
    },
    category: {
        type: String,
        required: [true, 'La categoría es obligatoria'],
        enum: ['juvenil', 'adulto', 'veterano'], // Ejemplo de categorías
        trim: true,
        lowercase: true,
    },
}, {
    timestamps: true,
});

// Índices para optimizar consultas
athleteSchema.index({ email: 1 });
athleteSchema.index({ category: 1, gender: 1 });

// Normalización de datos antes de guardar
athleteSchema.pre('save', function(next) {
    this.name = this.name.trim();
    this.category = this.category.trim().toLowerCase();
    next();
});

const Athlete = mongoose.model('Athlete', athleteSchema);

module.exports = Athlete;
