// backend/models/TimeRecord.js

const mongoose = require('mongoose');

const timeRecordSchema = new mongoose.Schema({
    athlete: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Athlete',
        required: true,
        index: true, // Índice para optimizar consultas por atleta
    },
    time: {
        type: Number,  // En segundos
        required: [true, 'El tiempo es obligatorio'],
        min: [0, 'El tiempo debe ser un número positivo'],
    },
}, {
    timestamps: true,
});

// Middleware para manejar la integridad referencial
timeRecordSchema.pre('save', async function(next) {
    try {
        const athleteExists = await mongoose.model('Athlete').findById(this.athlete);
        if (!athleteExists) {
            throw new Error('El atleta asociado no existe');
        }
        next();
    } catch (error) {
        next(error);
    }
});

// Índices para optimizar consultas
timeRecordSchema.index({ time: 1 }); // Índice para optimizar consultas por tiempo

const TimeRecord = mongoose.model('TimeRecord', timeRecordSchema);

module.exports = TimeRecord;
