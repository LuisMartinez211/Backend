// backend/controllers/timeController.js

const { check, validationResult } = require('express-validator');
const TimeRecord = require('../models/TimeRecord');
const Athlete = require('../models/Athlete');

// Validaciones para los datos de entrada
const validateTimeRecord = [
    check('athleteId', 'El ID del atleta no es válido').isMongoId(),
    check('time', 'El tiempo es requerido y debe ser un número positivo').isFloat({ min: 0 }),
];

// Registrar el tiempo de un atleta
const registerTime = async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ success: false, errors: errors.array() });
    }

    const { athleteId, time } = req.body;

    try {
        const athlete = await Athlete.findById(athleteId);
        if (!athlete) {
            return res.status(404).json({ success: false, message: 'Atleta no encontrado' });
        }

        const timeRecord = await TimeRecord.create({ athlete: athleteId, time });

        res.status(201).json({ success: true, data: timeRecord });
    } catch (error) {
        console.error('Error en registerTime:', error);
        res.status(500).json({ success: false, message: 'Error en el servidor', error: error.message });
    }
};

// Obtener tiempos por categoría con paginación
const getTimesByCategory = async (req, res) => {
    const { category } = req.params;
    const { page = 1, limit = 10 } = req.query;

    try {
        const times = await TimeRecord.find()
            .populate({
                path: 'athlete',
                match: { category },
            })
            .sort({ time: 1 })  // Ordenar por tiempo ascendente (mejor tiempo primero)
            .skip((page - 1) * limit)
            .limit(Number(limit));

        const filteredTimes = times.filter(timeRecord => timeRecord.athlete); // Filtrar los tiempos sin atleta
        if (filteredTimes.length === 0) {
            return res.status(404).json({ success: false, message: 'No se encontraron tiempos para la categoría especificada' });
        }

        res.status(200).json({ success: true, data: filteredTimes });
    } catch (error) {
        console.error('Error en getTimesByCategory:', error);
        res.status(500).json({ success: false, message: 'Error en el servidor', error: error.message });
    }
};

// Obtener los ganadores generales (mejores tiempos)
const getOverallWinners = async (req, res) => {
    try {
        const times = await TimeRecord.find()
            .populate('athlete')
            .sort({ time: 1 })  // Ordenar por tiempo ascendente (mejor tiempo primero)
            .limit(3);  // Obtener los tres mejores tiempos

        if (times.length === 0) {
            return res.status(404).json({ success: false, message: 'No se encontraron tiempos registrados' });
        }

        res.status(200).json({ success: true, data: times });
    } catch (error) {
        console.error('Error en getOverallWinners:', error);
        res.status(500).json({ success: false, message: 'Error en el servidor', error: error.message });
    }
};

module.exports = { registerTime, getTimesByCategory, getOverallWinners, validateTimeRecord };
