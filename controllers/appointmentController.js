const {
	Appointment,
	AppointmentHistory,
	User,
	DoctorAvailability,
	DoctorUnavailability,
} = require('../models');
const { Op } = require('sequelize');
const moment = require('moment');
const { divideIntoSlots } = require('../utils/timeSlots');

const getAllAppointments = async (req, res) => {
	try {
		const appointments = await Appointment.findAll({
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
		res.status(500).json({ message: 'Error al obtener los turnos', error });
	}
};

// Reservar un turno
const createAppointment = async (req, res) => {
	try {
		const { date, time, id_patient, id_doctor } = req.body;
		if (!date || !time || !id_patient || !id_doctor) {
			return res.status(400).json({ message: 'Faltan campos obligatorios' });
		}

		const weekday = moment(date).format('dddd').toLowerCase();
		const timeMoment = moment(time, 'HH:mm');
		const timeStr = timeMoment.format('HH:mm:ss');

		const availabilities = await DoctorAvailability.findAll({
			where: {
				id_doctor,
				weekday,
				start_time: { [Op.lte]: timeStr },
				end_time: { [Op.gt]: timeStr },
			},
		});

		if (!availabilities.length) {
			return res
				.status(400)
				.json({ message: 'El médico no atiende ese día' });
		}

		let slotFound = false;
		for (const av of availabilities) {
			const slots = divideIntoSlots(av.start_time, av.end_time);
			if (slots.some((slot) => slot.start_time === time)) {
				slotFound = true;
				break;
			}
		}

		if (!slotFound) {
			return res
				.status(400)
				.json({ message: 'El médico no atiende en ese horario' });
		}

		const isUnavailable = await DoctorUnavailability.findOne({
			where: {
				id_doctor,
				exception_date: date,
				is_available: false,
			},
		});

		if (isUnavailable) {
			return res
				.status(400)
				.json({ message: 'El médico no está disponible ese día' });
		}

		const exists = await Appointment.findOne({
			where: {
				id_doctor,
				date,
				time,
				status: { [Op.notIn]: ['cancelado'] },
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
			status: 'confirmado',
		});

		res.status(201).json(appointment);
	} catch (error) {
		console.error('Error en createAppointment:', error);
		res.status(500).json({ message: 'Error al crear turno', error });
	}
};

// Obtener los turnos de un usuario doctor
const getAppointmentsByDoctor = async (req, res) => {
	try {
		const { doctorId } = req.params;

		const appointments = await Appointment.findAll({
			where: {
				id_doctor: doctorId,
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
			message: 'Error al obtener turnos del doctor',
			error,
		});
	}
};

//Obtener los turnos por ID
const getAppointmentById = async (req, res) => {
	try {
		const { id } = req.params;

		const appointment = await Appointment.findOne({
			where: { id_appointment: id },
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
				{ model: AppointmentHistory, as: 'history' },
			],
		});

		if (!appointment) {
			return res.status(404).json({ message: 'Turno no encontrado' });
		}

		res.status(200).json(appointment);
	} catch (error) {
		res.status(500).json({ message: 'Error al obtener el turno', error });
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

		appointment.status = 'cancelado';
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
					status: { [Op.notIn]: ['cancelado'] },
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

		if (appointment.status !== 'completo') {
			appointment.status = 'completo';
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
	getAllAppointments,
	createAppointment,
	getAppointmentsByDoctor,
	getAppointmentById,
	cancelAppointment,
	updateAppointment,
	getMyAppointments,
	addOrUpdateAppointmentNotes,
};
