const winston = require('winston');
const path = require('path');
const fs = require('fs');

const logDir = path.join(__dirname, '../logs');
if (!fs.existsSync(logDir)) {
	fs.mkdirSync(logDir);
}

const logger = winston.createLogger({
	level: 'info',
	format: winston.format.combine(
		winston.format.timestamp(),
		winston.format.printf(({ level, message, timestamp }) => {
			return `[${timestamp}] ${level.toUpperCase()}: ${message}`;
		})
	),
	transports: [
		new winston.transports.Console(),
		new winston.transports.File({ filename: path.join(logDir, 'app.log') }),
	],
});

module.exports = logger;
