module.exports = (sequelize, DataTypes) => {
	const UserType = sequelize.define(
		'UserType',
		{
			id_user_type: {
				type: DataTypes.INTEGER,
				primaryKey: true,
				autoIncrement: true,
			},
			name: { type: DataTypes.STRING(50), unique: true, allowNull: false },
		},
		{
			tableName: 'user_types',
			timestamps: false,
		}
	);

	UserType.associate = (models) => {
		UserType.hasMany(models.User, { foreignKey: 'id_user_type' });
	};

	return UserType;
};
