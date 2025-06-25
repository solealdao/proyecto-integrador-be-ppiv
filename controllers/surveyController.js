const { Survey, Appointment, User } = require('../models');
const { Op } = require('sequelize');

const createSurvey = async (req, res) => {
	try {
		const { id_appointment } = req.params;
		const { rating, comment } = req.body;
		const userId = req.user.id;

		const appointment = await Appointment.findByPk(id_appointment);

		if (!appointment) {
			return res.status(404).json({ message: 'Turno no encontrado' });
		}

		if (appointment.status !== 'completo') {
			return res
				.status(400)
				.json({ message: 'No se puede calificar un turno no finalizado' });
		}

		if (appointment.id_patient !== userId) {
			return res
				.status(403)
				.json({ message: 'No autorizado para calificar este turno' });
		}

		const existingSurvey = await Survey.findOne({
			where: { id_appointment },
		});
		if (existingSurvey) {
			return res
				.status(409)
				.json({ message: 'Ya se ha enviado una encuesta para este turno' });
		}

		const newSurvey = await Survey.create({
			rating,
			comment,
			submitted_at: new Date(),
			id_appointment,
		});

		await appointment.update({ status: 'calificado' });

		res.status(201).json({
			message: 'Encuesta enviada con éxito',
			survey: newSurvey,
		});
	} catch (error) {
		console.error(error);
		res.status(500).json({ message: 'Error al crear la encuesta', error });
	}
};

const getAllSurveys = async (req, res) => {
	try {
		const surveys = await Survey.findAll({
			include: [
				{
					model: Appointment,
					include: [
						{
							model: User,
							as: 'patient',
							attributes: ['id_user', 'first_name', 'last_name'],
						},
						{
							model: User,
							as: 'doctor',
							attributes: ['id_user', 'first_name', 'last_name'],
						},
					],
				},
			],
		});

		res.status(200).json({ surveys });
	} catch (error) {
		console.error(error);
		res.status(500).json({
			message: 'Error al obtener las encuestas',
			error,
		});
	}
};

const getAllSurveysGroupedByDoctor = async (req, res) => {
	try {
		// traigo todas las encuestas junto con su cita, paciente y doctor
		const surveys = await Survey.findAll({
			include: [
				{
					model: Appointment,
					attributes: [
						'id_appointment',
						'id_doctor',
						'date',
						'time',
						'status',
					],
					include: [
						{
							model: User,
							as: 'patient',
							attributes: ['id_user', 'first_name', 'last_name'],
						},
						{
							model: User,
							as: 'doctor',
							attributes: ['id_user', 'first_name', 'last_name'],
						},
					],
				},
			],
		});

		// agrupo las encuestas por doctor usando el id_doctor
		const groupedByDoctor = surveys.reduce((acc, survey) => {
			const doctor = survey.Appointment.doctor;
			const doctorId = doctor.id_user;

			if (!acc[doctorId]) {
				acc[doctorId] = {
					doctor,
					surveys: [],
				};
			}

			acc[doctorId].surveys.push(survey);

			return acc;
		}, {});

		// convierto el objeto a array para mayor comodidad
		const result = Object.values(groupedByDoctor);

		res.status(200).json({ doctors: result });
	} catch (error) {
		console.error(error);
		res.status(500).json({ message: 'Error al obtener encuestas', error });
	}
};

module.exports = {
	createSurvey,
	getAllSurveys,
	getAllSurveysGroupedByDoctor,
};
