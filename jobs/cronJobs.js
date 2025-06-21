const cron = require('node-cron');
const { Appointment, User } = require('../models');
const { Op } = require('sequelize');
const moment = require('moment');
const sendMail = require('../utils/sendMail');

const sendAppointmentReminders = async () => {
	try {
		// Buscar turnos que son en las próximas 24 horas y están confirmados
		const now = moment();
		const nextDay = moment().add(24, 'hours');

		const upcomingAppointments = await Appointment.findAll({
			where: {
				status: 'confirmado',
				date: {
					[Op.gte]: now.format('YYYY-MM-DD'),
					[Op.lte]: nextDay.format('YYYY-MM-DD'),
				},
			},
			include: [
				{
					model: User,
					as: 'patient',
					attributes: ['first_name', 'last_name', 'email'],
				},
				{
					model: User,
					as: 'doctor',
					attributes: ['first_name', 'last_name'],
				},
			],
		});

		for (const appointment of upcomingAppointments) {
			if (appointment.patient.email) {
				const { first_name, last_name, email } = appointment.patient;
				const doctorName = `${appointment.doctor.first_name} ${appointment.doctor.last_name}`;

				await sendMail({
					to: email,
					subject: 'Recordatorio de turno próximo',
					html: `
                    <div style="font-family: Arial, sans-serif; color: #333;">
                    <h2 style="color: #2E86C1;">Recordatorio de turno próximo</h2>
                    <p>Hola <strong>${first_name} ${last_name}</strong>,</p>
                    <p>Te recordamos que tenés un turno con el Dr. <strong>${doctorName}</strong> programado para el <strong>${appointment.date}</strong> a las <strong>${appointment.time}</strong>.</p>
                    <p>Por favor, asegurate de llegar con tiempo.</p>
                    <hr style="border: none; border-top: 1px solid #ccc; margin: 20px 0;">
                    <p style="font-size: 0.9em; color: #777;">Este es un mensaje automático, por favor no respondas.</p>
                    </div>
                `,
				});
			}
		}
	} catch (error) {
		console.error('Error enviando recordatorios de turnos:', error);
	}
};

// Cron job que corre todos los días a las 9:00 AM
cron.schedule('0 9 * * *', () => {
	console.log('Ejecutando cron job para recordatorios de turnos...');
	sendAppointmentReminders();
});

// Para testeo rápido (solo comentar/descomentar según quieras)
// cron.schedule('* * * * *', () => {
// 	console.log('Ejecutando cron job para recordatorios de turnos...');
// 	sendAppointmentReminders();
// });
// sendAppointmentReminders();
