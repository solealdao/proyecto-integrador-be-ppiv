const { DoctorAvailability, DoctorUnavailability } = require('../models');
const { Op } = require('sequelize');

const getAllAvailabilities = async (req, res) => {
	try {
		const availabilities = await DoctorAvailability.findAll();
		res.status(200).json(availabilities);
	} catch (error) {
		res.status(500).json({
			message: 'Error al obtener las disponibilidades',
			error,
		});
	}
};

const getAvailabilityByDoctor = async (req, res) => {
	try {
		const { idDoctor } = req.params;

		const availabilities = await DoctorAvailability.findAll({
			where: { id_doctor: idDoctor },
		});

		res.status(200).json(availabilities);
	} catch (error) {
		res.status(500).json({
			message: 'Error al obtener la disponibilidad del doctor',
			error,
		});
	}
};

const getDoctorAgenda = async (req, res) => {
	try {
		const { idDoctor } = req.params;
		const { from, to } = req.query;

		const availabilities = await DoctorAvailability.findAll({
			where: { id_doctor: idDoctor },
		});

		const exceptions = await DoctorUnavailability.findAll({
			where: {
				id_doctor: idDoctor,
				exception_date: {
					[Op.between]: [from, to],
				},
			},
		});

		res.status(200).json({
			availabilities,
			exceptions,
		});
	} catch (error) {
		res.status(500).json({
			message: 'Error al obtener la agenda del doctor',
			error,
		});
	}
};

const createAvailability = async (req, res) => {
	try {
		const doctor_id = req.user.id;
		const { day_of_week, start_time, end_time } = req.body;

		const availability = await DoctorAvailability.create({
			id_doctor: doctor_id,
			weekday: day_of_week.toLowerCase(),
			start_time,
			end_time,
		});

		res.status(201).json(availability);
	} catch (error) {
		res.status(500).json({ message: 'Error al crear disponibilidad', error });
	}
};

const updateAvailability = async (req, res) => {
	try {
		const { id } = req.params;
		const { start_time, end_time } = req.body;

		const availability = await DoctorAvailability.findByPk(id);
		if (!availability) {
			return res
				.status(404)
				.json({ message: 'Disponibilidad no encontrada' });
		}

		if (availability.id_doctor !== req.user.id) {
			return res.status(403).json({ message: 'No autorizado' });
		}

		if (start_time) availability.start_time = start_time;
		if (end_time) availability.end_time = end_time;
		await availability.save();

		res.status(200).json(availability);
	} catch (error) {
		res.status(500).json({
			message: 'Error al actualizar disponibilidad',
			error,
		});
	}
};

const deleteAvailability = async (req, res) => {
	try {
		const { id } = req.params;

		const availability = await DoctorAvailability.findByPk(id);
		if (!availability) {
			return res
				.status(404)
				.json({ message: 'Disponibilidad no encontrada' });
		}

		if (availability.id_doctor !== req.user.id) {
			return res.status(403).json({ message: 'No autorizado' });
		}

		await availability.destroy();
		res.status(200).json({ message: 'Disponibilidad eliminada' });
	} catch (error) {
		res.status(500).json({
			message: 'Error al eliminar disponibilidad',
			error,
		});
	}
};

const addUnavailability = async (req, res) => {
	try {
		const id_doctor = req.user.id;
		const { date, reason, is_available } = req.body;

		const unavailability = await DoctorUnavailability.create({
			id_doctor,
			exception_date: date,
			reason,
			is_available: is_available ?? false,
		});

		res.status(201).json(unavailability);
	} catch (error) {
		res.status(500).json({
			message: 'Error al agregar indisponibilidad',
			error,
		});
	}
};

const removeUnavailability = async (req, res) => {
	try {
		const { id } = req.params;

		const unavailability = await DoctorUnavailability.findByPk(id);
		if (!unavailability) {
			return res
				.status(404)
				.json({ message: 'Indisponibilidad no encontrada' });
		}

		if (unavailability.id_doctor !== req.user.id) {
			return res.status(403).json({ message: 'No autorizado' });
		}

		await unavailability.destroy();
		res.status(200).json({ message: 'Indisponibilidad eliminada' });
	} catch (error) {
		res.status(500).json({
			message: 'Error al eliminar indisponibilidad',
			error,
		});
	}
};

module.exports = {
	getAllAvailabilities,
	getAvailabilityByDoctor,
	getDoctorAgenda,
	createAvailability,
	updateAvailability,
	deleteAvailability,
	addUnavailability,
	removeUnavailability,
};
