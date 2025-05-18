module.exports = (sequelize, DataTypes) => {
	const AppointmentHistory = sequelize.define(
		'AppointmentHistory',
		{
			id_history: {
				type: DataTypes.INTEGER,
				primaryKey: true,
				autoIncrement: true,
			},
			notes: { type: DataTypes.TEXT },
			id_appointment: { type: DataTypes.INTEGER, allowNull: false },
		},
		{
			tableName: 'appointment_history',
			timestamps: false,
		}
	);

	AppointmentHistory.associate = (models) => {
		AppointmentHistory.belongsTo(models.Appointment, {
			foreignKey: 'id_appointment',
		});
	};

	return AppointmentHistory;
};
