module.exports = (sequelize, DataTypes) => {
	const Survey = sequelize.define(
		'Survey',
		{
			id_survey: {
				type: DataTypes.INTEGER,
				primaryKey: true,
				autoIncrement: true,
			},
			rating: {
				type: DataTypes.INTEGER,
				validate: { min: 1, max: 5 },
			},
			comment: { type: DataTypes.TEXT },
			submitted_at: { type: DataTypes.DATE, allowNull: false },
			id_appointment: { type: DataTypes.INTEGER, allowNull: false },
		},
		{
			tableName: 'surveys',
			timestamps: false,
		}
	);

	Survey.associate = (models) => {
		Survey.belongsTo(models.Appointment, { foreignKey: 'id_appointment' });
	};

	return Survey;
};
