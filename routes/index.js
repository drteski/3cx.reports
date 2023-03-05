import express from 'express';
import getReport from '../services/3cx.service.js';
import parseCsv from '../services/parseCsv.service.js';
import prepareFile from '../services/prepareFile.service.js';

const router = express.Router();

router.get('/getthis', async (req, res) => {
	await getReport();
	await prepareFile();
	console.log('pobrane');
	res.redirect('/');
});

router.get('/', async (req, res) => {
	// await getReport();
	// await prepareFile();
	const data = await parseCsv();
	res.render('index', { title: 'Express', data });
});

export default router;
