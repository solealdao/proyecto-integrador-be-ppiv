const {
	DoctorAvailability,
	DoctorUnavailability,
	Appointment,
} = require('../models');
const { Op } = require('sequelize');
const { divideIntoSlots } = require('../utils/timeSlots');

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

		const slots = availabilities.flatMap((av) => {
			return divideIntoSlots(av.start_time, av.end_time).map((slot) => ({
				weekday: av.weekday,
				id_doctor: av.id_doctor,
				start_time: slot.start_time,
				end_time: slot.end_time,
			}));
		});

		res.status(200).json(slots);
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
		const existingAppointments = await Appointment.findAll({
			where: {
				id_doctor: idDoctor,
				date: { [Op.between]: [from, to] },
				status: { [Op.notIn]: ['cancelado'] },
			},
		});

		const exceptionDates = new Set(
			exceptions.map((e) =>
				new Date(e.exception_date).toISOString().slice(0, 10)
			)
		);

		const slots = [];

		const current = new Date(from);
		const end = new Date(to);
		const weekdayMap = [
			'sunday',
			'monday',
			'tuesday',
			'wednesday',
			'thursday',
			'friday',
			'saturday',
		];

		while (current <= end) {
			const dateStr = current.toISOString().slice(0, 10);
			const weekday = weekdayMap[current.getDay()];

			if (!exceptionDates.has(dateStr)) {
				availabilities
					.filter((av) => av.weekday === weekday)
					.forEach((av) => {
						const dailySlots = divideIntoSlots(
							av.start_time,
							av.end_time
						);
						dailySlots.forEach((slot) => {
							const slotKey = `${dateStr}T${slot.start_time}`;
							const existingAppointment = existingAppointments.find(
								(a) => `${a.date}T${a.time}` === slotKey
							);
							if (existingAppointment) {
								slots.push({
									date: dateStr,
									weekday,
									id_doctor: idDoctor,
									start_time: slot.start_time,
									end_time: slot.end_time,
									status: 'booked',
									patient_name:
										existingAppointment.patient_name || null,
									appointment_id: existingAppointment.id,
								});
							} else {
								slots.push({
									date: dateStr,
									weekday,
									id_doctor: idDoctor,
									start_time: slot.start_time,
									end_time: slot.end_time,
									status: 'available',
								});
							}
						});
					});
			}

			current.setDate(current.getDate() + 1);
		}

		res.status(200).json({
			slots,
			unavailabilities: exceptions.map((e) => ({
				exception_date: new Date(e.exception_date)
					.toISOString()
					.slice(0, 10),
				reason: e.reason || null,
			})),
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
		const { days_of_week, start_time, end_time } = req.body;

		if (!Array.isArray(days_of_week) || days_of_week.length === 0) {
			return res.status(400).json({
				message: 'days_of_week debe ser un array con al menos un día',
			});
		}

		const created = [];
		const conflicts = [];

		for (const day of days_of_week) {
			const lowercaseDay = day.toLowerCase();

			const overlaps = await DoctorAvailability.findOne({
				where: {
					id_doctor: doctor_id,
					weekday: lowercaseDay,
					[Op.and]: [
						{ start_time: { [Op.lt]: end_time } },
						{ end_time: { [Op.gt]: start_time } },
					],
				},
			});

			if (overlaps) {
				conflicts.push({
					day: lowercaseDay,
					message:
						'Ya existe una disponibilidad en ese horario que se solapa',
				});
				continue;
			}

			const availability = await DoctorAvailability.create({
				id_doctor: doctor_id,
				weekday: lowercaseDay,
				start_time,
				end_time,
			});

			created.push(availability);
		}

		if (conflicts.length > 0) {
			return res.status(207).json({
				message:
					'Algunas disponibilidades no se pudieron crear por conflictos',
				created,
				conflicts,
			});
		}

		res.status(201).json({ message: 'Disponibilidades creadas', created });
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

		const newStart = start_time || availability.start_time;
		const newEnd = end_time || availability.end_time;

		// Chequear solapamiento, excluyendo el actual
		const overlaps = await DoctorAvailability.findOne({
			where: {
				id_doctor: req.user.id,
				weekday: availability.weekday,
				id_schedule: { [Op.ne]: availability.id_schedule },
				[Op.and]: [
					{ start_time: { [Op.lt]: newEnd } },
					{ end_time: { [Op.gt]: newStart } },
				],
			},
		});

		if (overlaps) {
			return res.status(400).json({
				message:
					'Ya existe una disponibilidad en ese horario que se solapa',
			});
		}

		availability.start_time = newStart;
		availability.end_time = newEnd;
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
		console.log(error);
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
