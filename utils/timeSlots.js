const moment = require('moment');

function divideIntoSlots(startTime, endTime, slotDurationMinutes = 60) {
	const slots = [];
	let start = moment(startTime, 'HH:mm:ss');
	const end = moment(endTime, 'HH:mm:ss');

	while (start.add(slotDurationMinutes, 'minutes').isSameOrBefore(end)) {
		const slotStart = start.clone().subtract(slotDurationMinutes, 'minutes');
		const slotEnd = start.clone();
		slots.push({
			start_time: slotStart.format('HH:mm:ss'),
			end_time: slotEnd.format('HH:mm:ss'),
		});
	}

	return slots;
}

module.exports = {
	divideIntoSlots,
};
