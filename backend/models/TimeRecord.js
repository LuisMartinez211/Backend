// backend/models/TimeRecord.js

const mongoose = require('mongoose');

const timeRecordSchema = new mongoose.Schema({
    athlete: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Athlete',
        required: true,
    },
    time: {
        type: Number,  // En segundos, por ejemplo
        required: true,
    },
}, {
    timestamps: true,
});

const TimeRecord = mongoose.model('TimeRecord', timeRecordSchema);

module.exports = TimeRecord;
