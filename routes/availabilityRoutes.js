const express = require('express');
const router = express.Router();
const availabilityController = require('../controllers/availabilityController');
const authenticateToken = require('../middlewares/authenticateToken');

router.use(authenticateToken);

// Listar todas las disponibilidades
router.get('/', availabilityController.getAllAvailabilities);

// Listar disponibilidades por doctor
router.get('/doctor/:idDoctor', availabilityController.getAvailabilityByDoctor);

// Listar agenda completa por doctor (disponibilidades + excepciones)
router.get('/doctor/:idDoctor/agenda', availabilityController.getDoctorAgenda);

// Crear disponibilidad
router.post('/', availabilityController.createAvailability);

// Modificar disponibilidad
router.put('/:id', availabilityController.updateAvailability);

// Eliminar disponibilidad
router.delete('/:id', availabilityController.deleteAvailability);

// Crear indisponibilidad para un día específico
router.post('/unavailable', availabilityController.addUnavailability);

// Eliminar indisponibilidad
router.delete('/unavailable/:id', availabilityController.removeUnavailability);

module.exports = router;
