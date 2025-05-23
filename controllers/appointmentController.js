const { Appointment, AppointmentHistory, User } = require('../models');
const { Op } = require('sequelize');

// Reservar un turno
const createAppointment = async (req, res) => {
	try {
		const { date, time, id_patient, id_doctor } = req.body;

		if (!date || !time || !id_patient || !id_doctor) {
			return res.status(400).json({ message: 'Faltan campos obligatorios' });
		}

		const exists = await Appointment.findOne({
			where: {
				id_doctor,
				date,
				time,
				status: { [Op.notIn]: ['canceled'] },
			},
		});

		if (exists) {
			return res
				.status(409)
				.json({ message: 'Ese turno ya está reservado' });
		}

		const appointment = await Appointment.create({
			date,
			time,
			id_patient,
			id_doctor,
			status: 'confirmed',
		});

		res.status(201).json(appointment);
	} catch (error) {
		res.status(500).json({ message: 'Error al crear turno', error });
	}
};

// Obtener los turnos de un usuario (paciente o doctor)
const getAppointmentsByUser = async (req, res) => {
	try {
		const { userId } = req.params;

		const appointments = await Appointment.findAll({
			where: {
				[Op.or]: [{ id_patient: userId }, { id_doctor: userId }],
			},
			include: [
				{
					model: User,
					as: 'patient',
					attributes: ['first_name', 'last_name'],
				},
				{
					model: User,
					as: 'doctor',
					attributes: ['first_name', 'last_name'],
				},
			],
		});

		res.status(200).json(appointments);
	} catch (error) {
		res.status(500).json({
			message: 'Error al obtener turnos del usuario',
			error,
		});
	}
};

// Cancelar un turno
const cancelAppointment = async (req, res) => {
	try {
		const { id } = req.params;

		const appointment = await Appointment.findByPk(id);
		if (!appointment) {
			return res.status(404).json({ message: 'Turno no encontrado' });
		}

		appointment.status = 'canceled';
		await appointment.save();

		res.status(200).json({ message: 'Turno cancelado con éxito' });
	} catch (error) {
		res.status(500).json({ message: 'Error al cancelar turno', error });
	}
};

// Editar un turno
const updateAppointment = async (req, res) => {
	try {
		const { id } = req.params;
		const { date, time, id_patient, id_doctor } = req.body;

		const appointment = await Appointment.findOne({
			where: { id_appointment: id },
		});

		if (!appointment) {
			return res.status(404).json({ message: 'Turno no encontrado' });
		}

		if (id_doctor && date && time) {
			const conflict = await Appointment.findOne({
				where: {
					id_doctor,
					date,
					time,
					status: { [Op.notIn]: ['canceled'] },
					id_appointment: { [Op.ne]: id },
				},
			});

			if (conflict) {
				return res
					.status(409)
					.json({ message: 'Ya existe un turno en ese horario' });
			}
		}

		if (date) appointment.date = date;
		if (time) appointment.time = time;
		if (id_patient) appointment.id_patient = id_patient;
		if (id_doctor) appointment.id_doctor = id_doctor;

		await appointment.save();

		res.status(200).json({
			message: 'Turno actualizado con éxito',
			appointment,
		});
	} catch (error) {
		res.status(500).json({ message: 'Error al actualizar turno', error });
	}
};

//Para ver los turnos del usuario logueado
const getMyAppointments = async (req, res) => {
	try {
		const userId = req.user.id;

		const appointments = await Appointment.findAll({
			where: {
				[Op.or]: [{ id_patient: userId }, { id_doctor: userId }],
			},
			include: [
				{
					model: User,
					as: 'patient',
					attributes: ['first_name', 'last_name'],
				},
				{
					model: User,
					as: 'doctor',
					attributes: ['first_name', 'last_name'],
				},
			],
		});

		res.status(200).json(appointments);
	} catch (error) {
		res.status(500).json({ message: 'Error al obtener tus turnos', error });
	}
};

const addOrUpdateAppointmentNotes = async (req, res) => {
	try {
		const id_appointment = req.params.id;
		const { notes } = req.body;
		const userId = req.user.id;

		const appointment = await Appointment.findByPk(req.params.id);
		if (!appointment) {
			return res.status(404).json({ message: 'Turno no encontrado' });
		}

		if (appointment.id_doctor !== userId) {
			return res
				.status(403)
				.json({ message: 'No autorizado para modificar este turno' });
		}

		if (appointment.status !== 'completed') {
			appointment.status = 'completed';
			await appointment.save();
		}

		let history = await AppointmentHistory.findOne({
			where: { id_appointment },
		});

		if (history) {
			history.notes = notes;
			await history.save();
		} else {
			history = await AppointmentHistory.create({
				id_appointment,
				notes,
			});
		}

		res.status(200).json({
			message: 'Notas agregadas/actualizadas',
			history,
		});
	} catch (error) {
		res.status(500).json({ message: 'Error al agregar notas', error });
	}
};

module.exports = {
	createAppointment,
	getAppointmentsByUser,
	cancelAppointment,
	updateAppointment,
	getMyAppointments,
	addOrUpdateAppointmentNotes,
};
