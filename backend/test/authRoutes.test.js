// backend/tests/authRoutes.test.js

const request = require('supertest');
const mongoose = require('mongoose');
const app = require('../server'); // Asegúrate de exportar `app` desde server.js
const User = require('../models/User');

// Elimina la conexión aquí, ya está manejada en server.js
// beforeAll(async () => {
//     const url = process.env.MONGO_URI_TEST || "mongodb://localhost:27017/torneo-aguas-abiertas-test";
//     await mongoose.connect(url, {
//         useNewUrlParser: true,
//         useUnifiedTopology: true,
//     });
// });

afterAll(async () => {
    // Limpiar la base de datos y cerrar la conexión después de todas las pruebas
    await mongoose.connection.dropDatabase();
    await mongoose.connection.close();
});

describe('Auth Routes', () => {
    beforeEach(async () => {
        await User.deleteMany({});
    });

    test('Debe registrar un nuevo usuario', async () => {
        const response = await request(app)
            .post('/api/auth/register')
            .send({
                username: 'testuser',
                email: 'testuser@example.com',
                password: 'password123',
                role: 'participant',
            });

        expect(response.statusCode).toBe(201);
        expect(response.body).toHaveProperty('token');
        expect(response.body.role).toBe('participant');
    });

    test('No debe registrar un usuario con un correo ya existente', async () => {
        await User.create({
            username: 'existinguser',
            email: 'existinguser@example.com',
            password: 'password123',
            role: 'participant',
        });

        const response = await request(app)
            .post('/api/auth/register')
            .send({
                username: 'newuser',
                email: 'existinguser@example.com',
                password: 'password123',
                role: 'participant',
            });

        expect(response.statusCode).toBe(400);
        expect(response.body.message).toBe('Usuario ya existe');
    });

    test('Debe autenticar un usuario existente', async () => {
        await User.create({
            username: 'loginuser',
            email: 'loginuser@example.com',
            password: 'password123',
            role: 'admin',
        });

        const response = await request(app)
            .post('/api/auth/login')
            .send({
                email: 'loginuser@example.com',
                password: 'password123',
            });

        expect(response.statusCode).toBe(200);
        expect(response.body).toHaveProperty('token');
        expect(response.body.role).toBe('admin');
    });

    test('No debe autenticar un usuario con credenciales incorrectas', async () => {
        const response = await request(app)
            .post('/api/auth/login')
            .send({
                email: 'invaliduser@example.com',
                password: 'wrongpassword',
            });

        expect(response.statusCode).toBe(401);
        expect(response.body.message).toBe('Credenciales inválidas');
    });
});
