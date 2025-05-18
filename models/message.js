module.exports = (sequelize, DataTypes) => {
	const Message = sequelize.define(
		'Message',
		{
			id_message: {
				type: DataTypes.INTEGER,
				primaryKey: true,
				autoIncrement: true,
			},
			content: { type: DataTypes.TEXT, allowNull: false },
			sent_at: { type: DataTypes.DATE, allowNull: false },
			id_sender: { type: DataTypes.INTEGER, allowNull: false },
			id_receiver: { type: DataTypes.INTEGER, allowNull: false },
		},
		{
			tableName: 'messages',
			timestamps: false,
		}
	);

	Message.associate = (models) => {
		Message.belongsTo(models.User, { foreignKey: 'id_sender', as: 'sender' });
		Message.belongsTo(models.User, {
			foreignKey: 'id_receiver',
			as: 'receiver',
		});
	};

	return Message;
};
