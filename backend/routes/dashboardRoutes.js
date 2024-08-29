// backend/routes/dashboardRoutes.js

const express = require('express');
const router = express.Router();
const Athlete = require('../models/Athlete');
const TimeRecord = require('../models/TimeRecord');

// Ruta para obtener estadísticas generales
router.get('/statistics', async (req, res) => {
  try {
    // Obtener el número total de atletas
    const totalAthletes = await Athlete.countDocuments();

    // Calcular el tiempo promedio de los atletas
    const averageTimeResult = await TimeRecord.aggregate([
      {
        $group: {
          _id: null,
          averageTime: { $avg: "$time" }
        }
      }
    ]);

    // Si no hay registros de tiempo, el promedio será nulo o 0
    const averageTime = averageTimeResult.length > 0 ? averageTimeResult[0].averageTime : 0;

    // Puedes agregar más estadísticas aquí
    const statistics = {
      totalAthletes,
      totalCategories: 3,
      averageTime,  // Agregar el tiempo promedio a las estadísticas
    };

    // Enviar las estadísticas como respuesta
    res.json(statistics);
  } catch (error) {
    console.error('Error al obtener las estadísticas:', error);
    res.status(500).json({ message: 'Error al obtener las estadísticas' });
  }
});

module.exports = router;
