// backend/controllers/timeController.js

const TimeRecord = require('../models/TimeRecord');
const Athlete = require('../models/Athlete');

const registerTime = async (req, res) => {
    const { athleteId, time } = req.body;

    try {
        const athlete = await Athlete.findById(athleteId);
        if (!athlete) {
            return res.status(404).json({ message: 'Atleta no encontrado' });
        }

        const timeRecord = await TimeRecord.create({ athlete: athleteId, time });

        res.status(201).json(timeRecord);
    } catch (error) {
        console.error('Error en registerTime:', error);
        res.status(500).json({ message: 'Error en el servidor', error: error.message });
    }
};

const getTimesByCategory = async (req, res) => {
    const { category } = req.params;

    try {
        const times = await TimeRecord.find()
            .populate({
                path: 'athlete',
                match: { category },
            })
            .sort({ time: 1 });  // Ordenar por tiempo ascendente (mejor tiempo primero)

        res.status(200).json(times.filter(timeRecord => timeRecord.athlete));  // Filtrar los tiempos sin atleta
    } catch (error) {
        console.error('Error en getTimesByCategory:', error);
        res.status(500).json({ message: 'Error en el servidor', error: error.message });
    }
};

const getOverallWinners = async (req, res) => {
    try {
        const times = await TimeRecord.find()
            .populate('athlete')
            .sort({ time: 1 })  // Ordenar por tiempo ascendente (mejor tiempo primero)
            .limit(3);  // Obtener los tres mejores tiempos

        res.status(200).json(times);
    } catch (error) {
        console.error('Error en getOverallWinners:', error);
        res.status(500).json({ message: 'Error en el servidor', error: error.message });
    }
};

module.exports = { registerTime, getTimesByCategory, getOverallWinners };
