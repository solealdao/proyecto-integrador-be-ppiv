module.exports = (sequelize, DataTypes) => {
	const Notification = sequelize.define(
		'Notification',
		{
			id_notification: {
				type: DataTypes.INTEGER,
				primaryKey: true,
				autoIncrement: true,
			},
			message: { type: DataTypes.TEXT, allowNull: false },
			type: {
				type: DataTypes.ENUM('reminder', 'message', 'other'),
				allowNull: false,
			},
			sent_at: { type: DataTypes.DATE, allowNull: false },
			id_user: { type: DataTypes.INTEGER, allowNull: false },
		},
		{
			tableName: 'notifications',
			timestamps: false,
		}
	);

	Notification.associate = (models) => {
		Notification.belongsTo(models.User, { foreignKey: 'id_user' });
	};

	return Notification;
};
