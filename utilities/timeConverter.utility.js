const timeConverter = (time) => {
	if (time === '') return 0;
	const hms = time.split(':');
	return (
		parseInt(hms[0]) * 60 * 60 + parseInt(hms[1]) * 60 + parseInt(hms[2])
	);
};

export default timeConverter;
