const express = require('express');
const router = express.Router();
const appointmentController = require('../controllers/appointmentController');
const authenticateToken = require('../middlewares/authenticateToken');

// Todas las rutas requieren autenticación
router.use(authenticateToken);

router.get('/all', appointmentController.getAllAppointments);

// Crear un nuevo turno
router.post('/', appointmentController.createAppointment);

// Obtener los turnos del usuario logueado
router.get('/me', appointmentController.getMyAppointments);

// Ver detalle del turno
router.get('/:id', appointmentController.getAppointmentById);

// Modificar un turno
router.put('/:id', appointmentController.updateAppointment);

// Cancelar un turno
router.delete('/:id', appointmentController.cancelAppointment);

// Obtener turnos de un usuario doctor
router.get('/doctor/:doctorId', appointmentController.getAppointmentsByDoctor);

// Completar un turno con notas
router.post('/:id/complete', appointmentController.addOrUpdateAppointmentNotes);

module.exports = router;
