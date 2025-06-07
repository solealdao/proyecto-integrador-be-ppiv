const nodemailer = require('nodemailer');

async function sendMail({ to, subject, html }) {
	const transporter = nodemailer.createTransport({
		service: 'gmail',
		auth: {
			user: process.env.EMAIL_USER,
			pass: process.env.EMAIL_PASS,
		},
	});

	const mailOptions = {
		from: process.env.EMAIL_USER,
		to,
		subject,
		html,
	};

	return transporter.sendMail(mailOptions);
}

module.exports = sendMail;
