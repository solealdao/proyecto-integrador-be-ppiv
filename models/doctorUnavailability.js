module.exports = (sequelize, DataTypes) => {
	const DoctorUnavailability = sequelize.define(
		'DoctorUnavailability',
		{
			id_exception: {
				type: DataTypes.INTEGER,
				autoIncrement: true,
				primaryKey: true,
			},
			id_doctor: {
				type: DataTypes.INTEGER,
				allowNull: false,
			},
			exception_date: {
				type: DataTypes.DATEONLY,
				allowNull: false,
			},
			reason: {
				type: DataTypes.STRING,
			},
			is_available: {
				type: DataTypes.BOOLEAN,
				defaultValue: false,
			},
		},
		{
			tableName: 'doctor_exceptions',
			timestamps: false,
		}
	);

	DoctorUnavailability.associate = (models) => {
		DoctorUnavailability.belongsTo(models.User, {
			foreignKey: 'id_doctor',
			targetKey: 'id_user',
			as: 'doctor',
		});
	};

	return DoctorUnavailability;
};
