// middlewares/authorizeRole.js
const authorizeRole = (allowedRoles) => {
    return (req, res, next) => {
        // Primero, verifica si req.user existe
		//sole agregue esa validacion por los test
        if (!req.user || !req.user.id_user_type) {
            return res.status(403).json({ message: 'Acceso denegado' });
        }

        const { id_user_type } = req.user;

        if (!allowedRoles.includes(id_user_type)) {
            return res.status(403).json({ message: 'Acceso denegado' });
        }
        next();
    };
};

module.exports = authorizeRole;
