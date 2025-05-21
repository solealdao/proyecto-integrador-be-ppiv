module.exports = (sequelize, DataTypes) => {
	const DoctorAvailability = sequelize.define(
		'DoctorAvailability',
		{
			id_schedule: {
				type: DataTypes.INTEGER,
				autoIncrement: true,
				primaryKey: true,
				field: 'id_schedule',
			},
			id_doctor: {
				type: DataTypes.INTEGER,
				allowNull: false,
				field: 'id_doctor',
			},
			weekday: {
				type: DataTypes.ENUM(
					'monday',
					'tuesday',
					'wednesday',
					'thursday',
					'friday',
					'saturday',
					'sunday'
				),
				allowNull: false,
				field: 'weekday',
			},
			start_time: {
				type: DataTypes.TIME,
				allowNull: false,
				field: 'start_time',
			},
			end_time: {
				type: DataTypes.TIME,
				allowNull: false,
				field: 'end_time',
			},
		},
		{
			tableName: 'doctor_schedules',
			timestamps: false,
		}
	);

	DoctorAvailability.associate = (models) => {
		DoctorAvailability.belongsTo(models.User, {
			foreignKey: 'id_doctor',
			as: 'doctor',
		});
	};

	return DoctorAvailability;
};
