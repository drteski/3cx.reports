import csvtojson from 'csvtojson/v2/index.js';
import timeConverter from '../utilities/timeConverter.utility.js';

const parseCsv = async () => {
	const newFile = './data/ready.csv';

	const dat = await csvtojson()
		.fromFile(newFile)
		.then((json) => {
			const formatObj = json.map((obj, index) => {
				const extension =
					obj.Cel.match('\\((.*?)\\)') === null
						? ''
						: obj.Cel.match('\\((.*?)\\)')[1];
				const country = obj.Cel.replace(` (${extension})`, '');

				const callTime = timeConverter(obj.Dzwonienie);
				const talkTime = timeConverter(obj.Rozmowa);
				const totalTime = timeConverter(obj.Łącznie);
				const callCost = obj.Koszt === '' ? '0,00' : obj.Koszt;

				return {
					index: index + 1,
					time: obj['Czas połączenia'],
					caller: obj['Caller ID'],
					extension,
					country: country[0] + country.slice(1).toLowerCase(),
					status: obj.Status,
					callTime,
					talkTime,
					totalTime,
					callCost,
					callCause: obj.Powód,
				};
			});
			return formatObj.slice(0, -2);
		});
	return dat;
};
export default parseCsv;
