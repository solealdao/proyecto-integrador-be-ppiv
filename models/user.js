module.exports = (sequelize, DataTypes) => {
	const User = sequelize.define(
		'User',
		{
			id_user: {
				type: DataTypes.INTEGER,
				primaryKey: true,
				autoIncrement: true,
			},
			first_name: { type: DataTypes.CHAR(50), allowNull: false },
			last_name: { type: DataTypes.CHAR(50), allowNull: false },
			email: { type: DataTypes.CHAR(100), unique: true, allowNull: false },
			password: { type: DataTypes.CHAR(100), allowNull: false },
			id_user_type: { type: DataTypes.INTEGER, allowNull: false },
			is_active: {
				type: DataTypes.BOOLEAN,
				defaultValue: true,
			},
		},
		{
			tableName: 'users',
			timestamps: false,
		}
	);

	User.associate = (models) => {
		User.belongsTo(models.UserType, { foreignKey: 'id_user_type' });
		User.hasMany(models.Appointment, {
			foreignKey: 'id_patient',
			as: 'patientAppointments',
		});
		User.hasMany(models.Appointment, {
			foreignKey: 'id_doctor',
			as: 'doctorAppointments',
		});
		User.hasMany(models.Message, {
			foreignKey: 'id_sender',
			as: 'sentMessages',
		});
		User.hasMany(models.Message, {
			foreignKey: 'id_receiver',
			as: 'receivedMessages',
		});
	};

	return User;
};
