import gulp from 'gulp';
import gulpLoadPlugins from 'gulp-load-plugins';
import browserSync from 'browser-sync';
import del from 'del';
import {stream as wiredep} from 'wiredep';

const $ = gulpLoadPlugins();
const reload = browserSync.reload;

gulp.task('styles', () => {
	return gulp.src('app/styles/*.scss')
		.pipe($.plumber())
		.pipe($.sourcemaps.init())
		.pipe($.sass.sync({
			outputStyle: 'expanded',
			precision: 10,
			includePaths: ['.']
		}).on('error', $.sass.logError))
		.pipe($.autoprefixer({browsers: ['> 1%', 'last 2 versions', 'Firefox ESR']}))
		.pipe($.sourcemaps.write())
		.pipe(gulp.dest('.tmp/styles'))
		.pipe(reload({stream: true}));
});

gulp.task('scripts', () => {
	return gulp.src('app/scripts/**/*.js')
		.pipe($.plumber())
		.pipe($.sourcemaps.init())
		.pipe($.babel())
		.pipe($.sourcemaps.write('.'))
		.pipe(gulp.dest('.tmp/scripts'))
		.pipe(reload({stream: true}));
});

function lint(files, options) {
	return () => {
		return gulp.src(files)
			.pipe(reload({stream: true, once: true}))
			.pipe($.eslint(options))
			.pipe($.eslint.format())
	};
}

gulp.task('lint', lint('app/scripts/**/*.js'));

gulp.task('html', ['styles', 'scripts'], () => {
	return gulp.src('app/*.html')
		.pipe($.useref({searchPath: ['.tmp', 'app', '.']}))
		.pipe($.if('*.js', $.uglify()))
		.pipe($.if('*.css', $.uncss({
			html: ['app/*.html']
		})))
		.pipe($.if('*.css', $.cssnano()))
		.pipe($.if('*.html', $.htmlmin({collapseWhitespace: true})))
		.pipe(gulp.dest('dist'));
});

gulp.task('images', () => {
	return gulp.src('app/images/**/*')
		.pipe($.cache($.image({
			pngquant: true,
			optipng: false,
			zopflipng: true,
			advpng: true,
			jpegRecompress: true,
			jpegoptim: true,
			mozjpeg: true,
			gifsicle: true,
			svgo: true
		})))
		.pipe(gulp.dest('dist/images'));
});

gulp.task('fonts', () => {
	return gulp.src(require('main-bower-files')('**/*.{eot,svg,ttf,woff,woff2}', function (err) {})
		.concat('app/fonts/**/*'))
		.pipe(gulp.dest('.tmp/fonts'))
		.pipe(gulp.dest('dist/fonts'));
});

gulp.task('extras', () => {
	return gulp.src([
		'app/*.*',
		'!app/*.html'
	], {
		dot: true
	}).pipe(gulp.dest('dist'));
});

gulp.task('clean', del.bind(null, ['.tmp', 'dist']));

gulp.task('serve', ['styles', 'scripts', 'fonts'], () => {
	browserSync({
		notify: false,
		port: 9000,
		server: {
			baseDir: ['.tmp', 'app'],
			routes: {
				'/bower_components': 'bower_components'
			}
		}
	});

	gulp.watch([
		'app/*.html',
		'app/images/**/*',
		'.tmp/fonts/**/*'
	]).on('change', reload);

	gulp.watch('app/styles/**/*.scss', ['styles']);
	gulp.watch('app/scripts/**/*.js', ['scripts']);
	gulp.watch('app/fonts/**/*', ['fonts']);
	gulp.watch('bower.json', ['wiredep', 'fonts']);
});

gulp.task('serve:dist', () => {
	browserSync({
		notify: false,
		port: 9000,
		server: {
			baseDir: ['dist']
		}
	});
});

// inject bower components
gulp.task('wiredep', () => {
	gulp.src('app/styles/*.scss')
		.pipe(wiredep({
			ignorePath: /^(\.\.\/)+/
		}))
		.pipe(gulp.dest('app/styles'));

	gulp.src('app/*.html')
		.pipe(wiredep({
			exclude: ['bootstrap-sass'],
			ignorePath: /^(\.\.\/)*\.\./
		}))
		.pipe(gulp.dest('app'));
});

gulp.task('build', ['lint', 'html', 'images', 'fonts', 'extras'], () => {
	return gulp.src('dist/**/*').pipe($.size({title: 'build', gzip: true}));
});


gulp.task('default', ['clean'], () => {
	gulp.start('build');
});
