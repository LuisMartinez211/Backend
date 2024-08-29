// backend/models/Athlete.js

const mongoose = require('mongoose');

const athleteSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
        unique: true,
    },
    age: {
        type: Number,
        required: true,
    },
    gender: {
        type: String,
        enum: ['male', 'female'],
        required: true,
    },
    category: {
        type: String,
        required: true,
    },
}, {
    timestamps: true,
});

const Athlete = mongoose.model('Athlete', athleteSchema);

module.exports = Athlete;
