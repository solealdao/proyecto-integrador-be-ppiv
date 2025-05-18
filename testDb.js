const db = require('./models'); // o la ruta donde esté tu index.js de models

async function testConnection() {
	try {
		await db.sequelize.authenticate();
		console.log('Conexión con la base de datos exitosa.');

		// Solo si querés sincronizar modelos (crea tablas según modelos)
		//  await db.sequelize.sync({ force: false });
		//  console.log('Modelos sincronizados con la base de datos.');

		// Hacer alguna consulta simple para testear que los modelos funcionan
		const userTypes = await db.UserType.findAll();
		console.log('UserTypes en DB:', userTypes);
	} catch (error) {
		console.error('No se pudo conectar a la base de datos:', error);
	} finally {
		await db.sequelize.close();
	}
}

testConnection();
