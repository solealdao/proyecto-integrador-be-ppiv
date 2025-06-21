// Importamos la función del controlador que vamos a probar
const { createAppointment } = require('../controllers/appointmentController');

// Mockeamos el módulo completo '../models'
jest.mock('../models', () => ({
	// Exportamos un objeto con las propiedades mockeadas para cada modelo
	DoctorAvailability: {
		findAll: jest.fn(),
	},
	DoctorUnavailability: {
		findOne: jest.fn(),
	},
	Appointment: {
		findOne: jest.fn(),
		create: jest.fn(),
	},
}));

// Mockeamos cualquier función de utilidad externa que el controlador pueda usar.
jest.mock('../utils/timeSlots', () => ({
	divideIntoSlots: jest.fn(),
}));
describe('appointmentController - createAppointment', () => {
	beforeEach(() => {
		jest.clearAllMocks();
	});

	// Test 1: Crea un turno exitosamente cuando todos los campos requeridos
	// son proporcionados y el doctor está disponible.
	test('should create appointment when all required fields are provided and doctor is available', async () => {
		// Simulamos el objeto 'req' (request) que recibiría el controlador.
		const req = {
			body: {
				date: '2024-01-15',
				time: '10:00',
				id_patient: 1,
				id_doctor: 1,
			},
		};
		// Simulamos el objeto 'res' (response) que usaría el controlador para enviar la respuesta.
		const res = {
			status: jest.fn().mockReturnThis(),
			json: jest.fn(),
		};

		// Datos simulados para las respuestas de los mocks de los modelos
		const mockAvailability = {
			id_doctor: 1,
			weekday: 'monday',
			start_time: '09:00:00',
			end_time: '17:00:00',
		};

		const mockAppointment = {
			id: 1,
			date: '2024-01-15',
			time: '10:00',
			id_patient: 1,
			id_doctor: 1,
			status: 'confirmado',
		};

		// Configuramos el comportamiento de los mocks para este test específico.
		require('../models').DoctorAvailability.findAll.mockResolvedValue([
			mockAvailability,
		]);
		require('../models').DoctorUnavailability.findOne.mockResolvedValue(null);
		require('../models').Appointment.findOne.mockResolvedValue(null);
		require('../models').Appointment.create.mockResolvedValue(
			mockAppointment
		);

		// Configuramos el mock para la función de utilidad divideIntoSlots
		require('../utils/timeSlots').divideIntoSlots.mockReturnValue([
			{ start_time: '10:00', end_time: '10:30' },
		]);

		// Llamamos a la función del controlador que estamos probando.
		await createAppointment(req, res);

		// Verificamos las aserciones:
		expect(res.status).toHaveBeenCalledWith(201);
		expect(res.json).toHaveBeenCalledWith(mockAppointment);
		expect(require('../models').Appointment.create).toHaveBeenCalledWith({
			date: '2024-01-15',
			time: '10:00',
			id_patient: 1,
			id_doctor: 1,
			status: 'confirmado',
		});
	});

	// Test 2: Retorna un error 400 cuando faltan campos obligatorios
	test('should return 400 error when required fields are missing', async () => {
		// Simulamos un 'req' donde faltan campos esenciales.
		const req = {
			body: {
				date: '2024-01-15',
				time: '10:00', // Faltan id_patient y id_doctor
			},
		};
		// Simulamos el objeto 'res'
		const res = {
			status: jest.fn().mockReturnThis(),
			json: jest.fn(),
		};

		// Llamamos a la función del controlador.
		await createAppointment(req, res);

		// Verificamos las aserciones:
		expect(res.status).toHaveBeenCalledWith(400);
		expect(res.json).toHaveBeenCalledWith({
			message: 'Faltan campos obligatorios',
		});
		expect(require('../models').Appointment.create).not.toHaveBeenCalled();
		expect(
			require('../models').DoctorAvailability.findAll
		).not.toHaveBeenCalled();
	});

	// Test 3: Retorna un error cuando el doctor no está disponible en la fecha/hora solicitada.
	test('should return 400 error when doctor is not available at the requested time', async () => {
		const req = {
			body: {
				date: '2024-01-15',
				time: '10:00',
				id_patient: 1,
				id_doctor: 1,
			},
		};
		const res = {
			status: jest.fn().mockReturnThis(),
			json: jest.fn(),
		};

		// Simulamos que no hay disponibilidad para el doctor en esa fecha
		require('../models').DoctorAvailability.findAll.mockResolvedValue([]); // No hay disponibilidad
		require('../models').DoctorUnavailability.findOne.mockResolvedValue(null);
		require('../models').Appointment.findOne.mockResolvedValue(null);
		require('../models').Appointment.create.mockResolvedValue(null); // No se debería llamar a create

		// Simulamos que 'divideIntoSlots' no devuelve el slot solicitado
		require('../utils/timeSlots').divideIntoSlots.mockReturnValue([
			{ start_time: '11:00', end_time: '11:30' }, // Un slot diferente
		]);
		await createAppointment(req, res);
		expect(res.status).toHaveBeenCalledWith(400);
		expect(res.json).toHaveBeenCalledWith({
			message: 'El médico no atiende ese día',
		});
		expect(require('../models').Appointment.create).not.toHaveBeenCalled();
	});
});
