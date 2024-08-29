// backend/controllers/athleteController.js

const Athlete = require('../models/Athlete');

const registerAthlete = async (req, res) => {
    const { name, email, age, gender, category } = req.body;

    try {
        // Verificar si el atleta ya existe
        const athleteExists = await Athlete.findOne({ email });
        if (athleteExists) {
            return res.status(400).json({ message: 'El atleta ya está inscrito' });
        }

        // Crear un nuevo atleta
        const athlete = await Athlete.create({ name, email, age, gender, category });

        res.status(201).json(athlete);
    } catch (error) {
        console.error('Error en registerAthlete:', error);
        res.status(500).json({ message: 'Error en el servidor', error: error.message });
    }
};

const getAllAthletes = async (req, res) => {
    try {
        const athletes = await Athlete.find();
        res.status(200).json(athletes);
    } catch (error) {
        console.error('Error en getAllAthletes:', error);
        res.status(500).json({ message: 'Error en el servidor', error: error.message });
    }
};

module.exports = { registerAthlete, getAllAthletes };
