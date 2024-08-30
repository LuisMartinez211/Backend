// backend/server.js

const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const authRoutes = require('./routes/authRoutes');
const userRoutes = require('./routes/userRoutes');
const athleteRoutes = require('./routes/athleteRoutes');  // Nueva ruta de atletas
const timeRoutes = require('./routes/timeRoutes');  // Nueva ruta de tiempos
const dashboardRoutes = require('./routes/dashboardRoutes');  // Importa las rutas de dashboard

// Cargar las variables de entorno desde el archivo .env
dotenv.config();

// Inicializar la aplicación Express
const app = express();
// Habilitar CORS para permitir solicitudes desde el frontend
app.use(cors());

// Middleware para parsear JSON
app.use(express.json());

// Conectar a la base de datos MongoDB
mongoose.connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
})
.then(() => console.log('Conectado a MongoDB'))
.catch((err) => console.error('Error al conectar a MongoDB:', err));

app.set('trust proxy', 1);

// Rutas de autenticación
app.use('/api/auth', authRoutes);
app.use('/api', userRoutes);
app.use('/api/athletes', athleteRoutes);  // Nueva ruta de atletas
app.use('/api/times', timeRoutes);  // Nueva ruta de tiempos
app.use('/api/dashboard', dashboardRoutes);

// Ruta de ejemplo
app.get('/', (req, res) => {
    res.send('API de Torneo de Aguas Abiertas');
});

// Solo iniciar el servidor si no estamos en un entorno de pruebas
if (process.env.NODE_ENV !== 'test') {
    const PORT = process.env.PORT || 5000;
    app.listen(PORT, () => {
        console.log(`Servidor corriendo en el puerto ${PORT}`);
    });
}

module.exports = app;
