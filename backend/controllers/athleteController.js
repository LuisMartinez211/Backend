// backend/controllers/athleteController.js

const { check, validationResult } = require('express-validator');
const Athlete = require('../models/Athlete');

// Validaciones para los datos de entrada
const validateAthlete = [
    check('name', 'El nombre es obligatorio').notEmpty(),
    check('email', 'El correo electrónico no es válido').isEmail(),
    check('age', 'La edad debe ser un número positivo').isInt({ min: 0 }),
    check('gender', 'El género es obligatorio y debe ser masculino o femenino').isIn(['male', 'female']),
    check('category', 'La categoría es obligatoria').notEmpty()
];

// Registrar un nuevo atleta
const registerAthlete = async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ success: false, errors: errors.array() });
    }

    const { name, email, age, gender, category } = req.body;

    try {
        const athleteExists = await Athlete.findOne({ email });
        if (athleteExists) {
            return res.status(400).json({ success: false, message: 'El atleta ya está inscrito' });
        }

        const athlete = await Athlete.create({ name, email, age, gender, category });
        res.status(201).json({ success: true, data: athlete });
    } catch (error) {
        console.error('Error en registerAthlete:', error);
        res.status(500).json({ success: false, message: 'Error en el servidor', error: error.message });
    }
};

// Obtener todos los atletas
const getAllAthletes = async (req, res) => {
    try {
        const athletes = await Athlete.find();
        if (athletes.length === 0) {
            return res.status(404).json({ success: false, message: 'No se encontraron atletas' });
        }
        res.status(200).json({ success: true, data: athletes });
    } catch (error) {
        console.error('Error en getAllAthletes:', error);
        res.status(500).json({ success: false, message: 'Error en el servidor', error: error.message });
    }
};

// Actualizar un atleta
const updateAthlete = async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ success: false, errors: errors.array() });
    }

    const { id } = req.params;
    const { name, email, age, gender, category } = req.body;

    try {
        const athlete = await Athlete.findById(id);
        if (!athlete) {
            return res.status(404).json({ success: false, message: 'Atleta no encontrado' });
        }

        athlete.name = name || athlete.name;
        athlete.email = email || athlete.email;
        athlete.age = age || athlete.age;
        athlete.gender = gender || athlete.gender;
        athlete.category = category || athlete.category;

        await athlete.save();

        res.status(200).json({ success: true, data: athlete });
    } catch (error) {
        console.error('Error en updateAthlete:', error);
        res.status(500).json({ success: false, message: 'Error en el servidor', error: error.message });
    }
};

// Eliminar un atleta
const deleteAthlete = async (req, res) => {
    const { id } = req.params;

    try {
        const athlete = await Athlete.findById(id);
        if (!athlete) {
            return res.status(404).json({ success: false, message: 'Atleta no encontrado' });
        }

        await athlete.remove();
        res.status(200).json({ success: true, message: 'Atleta eliminado correctamente' });
    } catch (error) {
        console.error('Error en deleteAthlete:', error);
        res.status(500).json({ success: false, message: 'Error en el servidor', error: error.message });
    }
};

module.exports = { registerAthlete, getAllAthletes, updateAthlete, deleteAthlete, validateAthlete };
