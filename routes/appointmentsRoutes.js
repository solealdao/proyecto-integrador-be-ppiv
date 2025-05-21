const express = require('express');
const router = express.Router();
const appointmentController = require('../controllers/appointmentController');
const authenticateToken = require('../middlewares/authenticateToken');

// Todas las rutas requieren autenticación
router.use(authenticateToken);

// Crear un nuevo turno
router.post('/', appointmentController.createAppointment);

// Modificar un turno
router.put('/:id', appointmentController.updateAppointment);

// Cancelar un turno
router.delete('/:id', appointmentController.cancelAppointment);

// Obtener los turnos del usuario logueado
router.get('/me', appointmentController.getMyAppointments);

// Obtener turnos de un usuario específico (admin u otros casos)
router.get('/user/:userId', appointmentController.getAppointmentsByUser);

// Completar un turno con notas
router.post('/:id/complete', appointmentController.addOrUpdateAppointmentNotes);

module.exports = router;
