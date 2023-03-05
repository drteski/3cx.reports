import { createClient, ReportsClient } from '@3cx/api';
import fs from 'fs';
import dotenv from 'dotenv';

dotenv.config({ path: '../.env' });

const { CX_LOGIN, CX_PASSWORD, CX_LINK } = process.env;

const getReport = async () => {
	const http = await createClient(CX_LINK, {
		Username: CX_LOGIN,
		Password: CX_PASSWORD,
	});
	const reports = new ReportsClient(http);

	const allReports = await reports.getExistingReports();

	const allCsvReports = allReports.list.filter((report) => {
		if (report.Key.match(/(.csv)/gm)) {
			return report;
		}
		return;
	});

	await reports.downloadReport(allCsvReports[0].Url).then((res) => {
		fs.promises.writeFile(
			'./data/reports/downloaded.csv',
			res.data,
			'utf8',
			(error) => {
				console.log(error);
			}
		);
		console.log('file saved');
	});
};
export default getReport;
