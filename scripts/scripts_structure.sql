const request = require('supertest');
const app = require('../app');
const db = require('../models');

// Evita la validación del token en los tests
jest.mock('../middlewares/authenticateToken', () => (req, res, next) => next());

beforeAll(async () => {
  await db.sequelize.sync({ force: true });

  // Crear datos de prueba
  const patient = await db.User.create({
    first_name: 'Paciente',
    last_name: 'Test',
    email: 'paciente@test.com',
    password: 'hashedpassword',
    id_user_type: 1, // asumimos que ya existe el tipo paciente
  });

  const doctor = await db.User.create({
    first_name: 'Doctor',
    last_name: 'Test',
    email: 'doctor@test.com',
    password: 'hashedpassword',
    id_user_type: 2, // asumimos que ya existe el tipo doctor
  });

  global.testData = { patientId: patient.id_user, doctorId: doctor.id_user };
});

afterAll(async () => {
  await db.sequelize.close();
});

describe('Test de rutas /appointments', () => {
  test('POST /appointments - crear turno', async () => {
    const res = await request(app)
      .post('/appointments')
      .send({
        date: '2025-06-15',
        time: '10:00',
        status: 'pending',
        id_patient: global.testData.patientId,
        id_doctor: global.testData.doctorId,
      });

    expect(res.statusCode).toBe(201);
    expect(res.body).toHaveProperty('id_appointment');
  });
});
