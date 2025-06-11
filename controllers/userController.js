const { User, UserType } = require('../models');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const SECRET_KEY = process.env.SECRET_KEY;

//Consultar listado de usuarios
const getAllUsers = async (req, res) => {
	try {
		const users = await User.findAll({ where: { is_active: true } });

		res.json(users);
	} catch (error) {
		res.status(500).json({
			message: 'Error al obtener usuarios',
			error: error.message,
		});
	}
};

// Obtener usuario por id (detalle)
const getUserById = async (req, res) => {
	try {
		const { id } = req.params;

		const user = await User.findByPk(id, { include: UserType });

		if (!user)
			return res.status(404).json({ message: 'Usuario no encontrado' });

		res.json(user);
	} catch (error) {
		res.status(500).json({
			message: 'Error al obtener usuario',
			error: error.message,
		});
	}
};

// Registrar usuario
const register = async (req, res) => {
	try {
		const { first_name, last_name, email, password, id_user_type } = req.body;

		const existingUser = await User.findOne({ where: { email } });
		if (existingUser)
			return res.status(400).json({ message: 'Email ya registrado' });

		const hashedPassword = await bcrypt.hash(password, 10);

		const newUser = await User.create({
			first_name,
			last_name,
			email,
			password: hashedPassword,
			id_user_type,
		});

		res.status(201).json({ message: 'Usuario creado', user: newUser });
	} catch (error) {
		res.status(500).json({
			message: 'Error al registrar usuario',
			error: error.message,
		});
	}
};

// Login usuario
const login = async (req, res) => {
	try {
		const { email, password } = req.body;

		const user = await User.findOne({ where: { email }, include: UserType });

		if (!user)
			return res.status(404).json({ message: 'Usuario no encontrado' });

		const match = await bcrypt.compare(password, user.password);
		if (!match)
			return res.status(401).json({ message: 'Contraseña incorrecta' });

		const token = jwt.sign(
			{ id: user.id_user, email: user.email },
			SECRET_KEY,
			{ expiresIn: '1h' }
		);

		res.json({ message: 'Login exitoso', token, user });
	} catch (error) {
		console.error('Error en login:', error); // Mostrar error en consola
		res.status(500).json({ message: 'Error en login', error: error.message });
	}
};

// Editar usuario
const updateUser = async (req, res) => {
	try {
		const { id } = req.params;
		const { first_name, last_name, email, id_user_type } = req.body;

		const user = await User.findByPk(id);
		if (!user)
			return res.status(404).json({ message: 'Usuario no encontrado' });

		user.first_name = first_name ?? user.first_name;
		user.last_name = last_name ?? user.last_name;
		user.email = email ?? user.email;
		user.id_user_type = id_user_type ?? user.id_user_type;

		await user.save();

		res.json({ message: 'Usuario actualizado', user });
	} catch (error) {
		res.status(500).json({
			message: 'Error al actualizar usuario',
			error: error.message,
		});
	}
};

// Eliminar usuario
const deleteUser = async (req, res) => {
	try {
		const { id } = req.params;

		const user = await User.findByPk(id);
		if (!user)
			return res.status(404).json({ message: 'Usuario no encontrado' });

		await user.update({ is_active: false });

		res.json({ message: 'Usuario inactivado' });
	} catch (error) {
		res.status(500).json({
			message: 'Error al inactivar usuario',
			error: error.message,
		});
	}
};

module.exports = {
	getAllUsers,
	getUserById,
	register,
	login,
	updateUser,
	deleteUser,
};
