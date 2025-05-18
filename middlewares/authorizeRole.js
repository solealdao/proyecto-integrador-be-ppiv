const authorizeRole = (allowedRoles) => {
	return (req, res, next) => {
		const { id_user_type } = req.user;

		if (!allowedRoles.includes(id_user_type)) {
			return res.status(403).json({ message: 'Acceso denegado' });
		}
		next();
	};
};

module.exports = authorizeRole;
