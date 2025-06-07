const { Message, User } = require('../models');
const { Op } = require('sequelize');
const sendMail = require('../utils/sendMail');

const getAvailableUsers = async (req, res) => {
	try {
		// Buscamos al usuario completo en la base
		const currentUser = await User.findOne({
			where: { id_user: req.user.id },
			attributes: ['id_user', 'id_user_type'],
		});

		if (!currentUser) {
			return res.status(404).json({ message: 'Usuario no encontrado' });
		}
		let users = [];
		if (currentUser.id_user_type === 1) {
			users = await User.findAll({
				where: {
					id_user_type: [2, 3],
				},
				attributes: ['id_user', 'first_name', 'last_name', 'id_user_type'],
			});
		} else if ([2, 3].includes(currentUser.id_user_type)) {
			users = await User.findAll({
				where: {
					id_user_type: 1,
				},
				attributes: ['id_user', 'first_name', 'last_name', 'id_user_type'],
			});
		}

		res.json(users);
	} catch (error) {
		console.error(error);
		res.status(500).json({
			message: 'Error al obtener usuarios disponibles',
		});
	}
};

const getConversation = async (req, res) => {
	const currentUserId = req.user.id;
	const targetUserId = parseInt(req.params.userId);

	const messages = await Message.findAll({
		where: {
			[Op.or]: [
				{
					id_sender: currentUserId,
					id_receiver: targetUserId,
				},
				{
					id_sender: targetUserId,
					id_receiver: currentUserId,
				},
			],
		},
		order: [['sent_at', 'ASC']],
	});

	res.json(messages);
};

const sendMessage = async (req, res) => {
	try {
		const { id_receiver, content } = req.body;
		const id_sender = req.user.id;

		if (!content || !id_receiver) {
			return res.status(400).json({ message: 'Datos incompletos' });
		}

		const newMessage = await Message.create({
			content,
			sent_at: new Date(),
			id_sender,
			id_receiver,
		});

		const receiver = await User.findByPk(id_receiver);
		const sender = await User.findByPk(id_sender);

		if (receiver && receiver.email) {
			await sendMail({
				to: receiver.email,
				subject: `Nuevo mensaje de ${sender.first_name}`,
				html: `<p>Hola ${receiver.first_name},</p>
         				<p>Tenés un nuevo mensaje en la plataforma:</p>
         				<blockquote>${content}</blockquote>
        				 <p>Iniciá sesión para responder.</p>`,
			});
		}

		res.status(201).json(newMessage);
	} catch (error) {
		console.error('Error en sendMessage:', error);
		res.status(500).json({
			message: 'Error al enviar el mensaje',
			error: error.message,
		});
	}
};

module.exports = {
	getAvailableUsers,
	getConversation,
	sendMessage,
};
