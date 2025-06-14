const express = require('express');
const request = require('supertest');

describe('userRoutes', () => {
  let app;
  let userController;

  beforeEach(async () => {
    jest.resetModules();
    jest.clearAllMocks();

    // Aquí definimos el mock EXPLÍCITAMENTE con jest.doMock antes de importar el router
    jest.doMock('../controllers/userController', () => ({
      register: jest.fn((req, res) => res.status(201).json({ message: 'Usuario creado' })),
      getUserById: jest.fn((req, res) => res.status(200).json({ id: '42' })),
      getAllUsers: jest.fn((req, res) => res.status(200).json([])),
      login: jest.fn((req, res) => res.status(200).json({ token: 'fake-token' })),
      updateUser: jest.fn((req, res) => res.status(200).json({ message: 'Usuario actualizado' })),
      deleteUser: jest.fn((req, res) => res.status(200).json({ message: 'Usuario inactivado' })),
    }));

    // Ahora importamos el controlador mockeado
    userController = require('../controllers/userController');

    // Luego importamos el router (que importará el mock)
    const userRoutes = require('../routes/userRoutes');

    app = express();
    app.use(express.json());
    app.use('/users', userRoutes);
  });

  test('should route POST /users/register to userController.register', async () => {
    const res = await request(app).post('/users/register').send({ email: 'test@example.com', password: '1234' });

    expect(res.statusCode).toBe(201);
    expect(res.body.message).toBe('Usuario creado');
    expect(userController.register).toHaveBeenCalled();
  });

});
