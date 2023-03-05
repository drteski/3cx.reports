import gulp from 'gulp';
import browserSync from 'browser-sync';
import nodemon from 'gulp-nodemon';
import postcss from 'gulp-postcss';
import babel from 'gulp-babel';
import minify from 'gulp-minify';
import uglify from 'gulp-uglify';
import sourcemaps from 'gulp-sourcemaps';
import rename from 'gulp-rename';
import autoprefixer from 'autoprefixer';
import cssnano from 'cssnano';
import dotenv from 'dotenv';
import dartSass from 'sass';
import gulpSass from 'gulp-sass';

const sass = gulpSass(dartSass);
dotenv.config();

gulp.task('js', () => {
	return gulp
		.src('public/javascript/dev.js')
		.pipe(rename('index.js'))
		.pipe(sourcemaps.init())
		.pipe(
			babel({
				presets: [
					[
						'@babel/preset-env',
						{
							bugfixes: true,
							corejs: 3,
							modules: false,
							targets: 'safari > 13.1',
							useBuiltIns: 'usage',
						},
					],
				],
			})
		)
		.pipe(uglify())
		.pipe(minify())
		.pipe(sourcemaps.write())
		.pipe(gulp.dest('public/javascript/'));
});

gulp.task('style', () => {
	const plugins = [autoprefixer(), cssnano()];
	return gulp
		.src('public/styles/style.scss')
		.pipe(sass().on('error', sass.logError))
		.pipe(postcss(plugins))
		.pipe(sourcemaps.write())
		.pipe(gulp.dest('public/styles/'));
});

gulp.task(
	'watch',
	gulp.series('style', 'js', (done) => {
		gulp.watch('public/javascript/dev.js', gulp.series('js'));
		gulp.watch('public/styles/**.scss', gulp.series('style'));
		gulp.watch('public/styles/*/**.scss', gulp.series('style'));
		done();
	})
);

gulp.task('nodemon', (cb) => {
	let started = false;
	return nodemon({
		ext: 'js html css scss hbs',
		script: './bin/www.js',
	}).on('start', () => {
		if (!started) {
			cb();
			started = true;
		}
	});
});

gulp.task(
	'browser-sync',
	gulp.series('nodemon', () => {
		browserSync.init(null, {
			proxy: `${process.env.BASE_URL}:${process.env.PORT}`,
			files: ['../'],
			port: process.env.PROXY_PORT,
		});
	})
);

gulp.task('default', gulp.parallel('watch', 'browser-sync'));
gulp.task('build', gulp.parallel('js', 'style'));
