// backend/routes/dashboardRoutes.js

const express = require('express');
const router = express.Router();
const Athlete = require('../models/Athlete');
const TimeRecord = require('../models/TimeRecord');
const { protect, authorize } = require('../middleware/authMiddleware');

// Ruta para obtener estadísticas generales (Acceso: solo admin)
router.get('/statistics', protect, authorize('admin'), async (req, res) => {
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

    const averageTime = averageTimeResult.length > 0 ? averageTimeResult[0].averageTime : 0;

    // Calcular el mejor y peor tiempo registrado
    const bestTimeRecord = await TimeRecord.findOne().sort({ time: 1 }).populate('athlete');
    const worstTimeRecord = await TimeRecord.findOne().sort({ time: -1 }).populate('athlete');

    const statistics = {
      totalAthletes,
      totalCategories: 3,  // Ejemplo de estadística estática
      averageTime,
      bestTime: bestTimeRecord ? bestTimeRecord.time : null,
      worstTime: worstTimeRecord ? worstTimeRecord.time : null,
      bestAthlete: bestTimeRecord ? bestTimeRecord.athlete : null,
      worstAthlete: worstTimeRecord ? worstTimeRecord.athlete : null
    };

    // Enviar las estadísticas como respuesta
    res.status(200).json({
      success: true,
      data: statistics
    });
  } catch (error) {
    console.error('Error al obtener las estadísticas:', error);
    res.status(500).json({ success: false, message: 'Error al obtener las estadísticas', error: error.message });
  }
});

module.exports = router;
