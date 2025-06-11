const express = require('express');
const router = express.Router();
const surveyController = require('../controllers/surveyController');
const authenticateToken = require('../middlewares/authenticateToken');

router.use(authenticateToken);

router.post('/:id_appointment', surveyController.createSurvey);

router.get('/', surveyController.getAllSurveys);

router.get('/by-doctor', surveyController.getAllSurveysGroupedByDoctor);

module.exports = router;
