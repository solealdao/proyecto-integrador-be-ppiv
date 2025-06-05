var express = require('express');
const cors = require('cors');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
require('dotenv').config();

var indexRouter = require('./routes/index');
var userRoutes = require('./routes/userRoutes');
var appointmentRoutes = require('./routes/appointmentsRoutes');
var availabilityRoutes = require('./routes/availabilityRoutes');
var messageRoutes = require('./routes/messageRoutes');

var app = express();

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(
	cors({
		origin: 'http://localhost:3000',
		credentials: true,
	})
);

app.use('/', indexRouter);
app.use('/api/users', userRoutes);
app.use('/api/appointments', appointmentRoutes);
app.use('/api/availability', availabilityRoutes);
app.use('/api/messages', messageRoutes);

module.exports = app;
