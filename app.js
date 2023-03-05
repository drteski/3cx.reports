import dotenv from 'dotenv';
import createError from 'http-errors';
import express from 'express';
import path from 'path';
import helmet from 'helmet';
import compression from 'compression';
import cookieParser from 'cookie-parser';
import logger from 'morgan';
import Sequelize from 'sequelize';
import handlebars from 'express-handlebars';
import fileDirName from './utilities/fileDirName.js';
// routes
import indexRouter from './routes/index.js';
import importRouter from './routes/import.js';
import chartRouter from './routes/chart.js';
import tableRouter from './routes/table.js';
import reportRouter from './routes/report.js';

dotenv.config();

const { __dirname, __filename } = fileDirName(import.meta);

const app = express();
const oneDay = 1000 * 60 * 60 * 24;

const sequelize = new Sequelize(process.env.POSTGRES_DB, {
	logging: console.log,
});

const kek = async () => {
	try {
		await sequelize.authenticate();
		console.log('Connection has been established successfully.');
	} catch (error) {
		console.error('Unable to connect to the database:', error);
	}
};
kek();
// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', '.hbs');
app.engine(
	'.hbs',
	handlebars.engine({
		extname: '.hbs',
		defaultLayout: 'main',
		layoutsDir: __dirname + '/views/layouts',
		partialsDir: __dirname + '/views/partials',
		runtimeOptions: {
			allowProtoPropertiesByDefault: true,
			allowProtoMethodsByDefault: true,
		},
	})
);
// app.use(compression());
// app.use(helmet());
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/import', importRouter);
app.use('/chart', chartRouter);
app.use('/table', tableRouter);
app.use('/report', reportRouter);

// catch 404 and forward to error handler
app.use((req, res, next) => {
	next(createError(404));
});

// error handler
app.use((err, req, res, next) => {
	// set locals, only providing error in development
	res.locals.message = err.message;
	res.locals.error = req.app.get('env') === 'development' ? err : {};

	// render the error page
	res.status(err.status || 500);
	res.render('error');
});

// module.exports = app;

export default app;
