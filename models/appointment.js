module.exports = (sequelize, DataTypes) => {
	const Appointment = sequelize.define(
		'Appointment',
		{
			id_appointment: {
				type: DataTypes.INTEGER,
				primaryKey: true,
				autoIncrement: true,
			},
			date: { type: DataTypes.DATEONLY, allowNull: false },
			time: { type: DataTypes.TIME, allowNull: false },
			status: {
				type: DataTypes.ENUM(
					'confirmado',
					'cancelado',
					'completo',
					'calificado'
				),
				allowNull: false,
			},
			id_patient: { type: DataTypes.INTEGER, allowNull: false },
			id_doctor: { type: DataTypes.INTEGER, allowNull: false },
		},
		{
			tableName: 'appointments',
			timestamps: false,
		}
	);

	Appointment.associate = (models) => {
		Appointment.belongsTo(models.User, {
			foreignKey: 'id_patient',
			as: 'patient',
		});
		Appointment.belongsTo(models.User, {
			foreignKey: 'id_doctor',
			as: 'doctor',
		});
		Appointment.hasMany(models.AppointmentHistory, {
			foreignKey: 'id_appointment',
			as: 'history',
		});
		Appointment.hasMany(models.Survey, { foreignKey: 'id_appointment' });
	};

	return Appointment;
};
