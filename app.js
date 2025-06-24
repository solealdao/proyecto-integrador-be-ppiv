var express = require('express');
const cors = require('cors');
var path = require('path');
var cookieParser = require('cookie-parser');
var morgan = require('morgan');
const fs = require('fs');
var logger = require('morgan');
require('dotenv').config();

const customLogger = require('./utils/logger');

require('./jobs/cronJobs');

var indexRouter = require('./routes/index');
var userRoutes = require('./routes/userRoutes');
var appointmentRoutes = require('./routes/appointmentsRoutes');
var availabilityRoutes = require('./routes/availabilityRoutes');
var messageRoutes = require('./routes/messageRoutes');
var surveyRoutes = require('./routes/surveyRoutes');

var app = express();

// Logging de HTTP con morgan a consola y archivo
const logStream = fs.createWriteStream(
	path.join(__dirname, 'logs/access.log'),
	{ flags: 'a' }
);

const allowedOrigins = [
	'http://localhost:3000',
	'https://proyecto-integrador-ppiv.vercel.app',
];
app.use(morgan('dev'));
app.use(morgan('combined', { stream: logStream }));

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(
	cors({
		origin: function (origin, callback) {
			if (!origin || allowedOrigins.includes(origin)) {
				callback(null, true);
			} else {
				callback(new Error('Not allowed by CORS'));
			}
		},
		credentials: true,
	})
);

// Loguear arranque del backend
customLogger.info('Aplicación Express inicializada');

app.use('/', indexRouter);
app.use('/api/users', userRoutes);
app.use('/api/appointments', appointmentRoutes);
app.use('/api/availability', availabilityRoutes);
app.use('/api/messages', messageRoutes);
app.use('/api/surveys', surveyRoutes);

module.exports = app;
