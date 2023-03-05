import fs from 'fs';

const prepareFile = async () => {
	await fs.readFile(
		'./data/reports/downloaded.csv',
		'utf8',
		(error, data) => {
			if (error) return console.log(error);
			const deleteFirstRows = data.substring(
				data.indexOf('Czas połączenia')
			);
			fs.writeFileSync('./data/ready.csv', deleteFirstRows, 'utf8');
			console.log('File saved');
		}
	);
};
export default prepareFile;
