'use strict';
 
var gulp = require('gulp');

var sass = require('gulp-sass'),
    autoprefixer = require('gulp-autoprefixer'),
    minifycss = require('gulp-minify-css'),
    rename = require('gulp-rename'),
    sourcemaps = require('gulp-sourcemaps'),
    livereload = require('gulp-livereload'),
    concat = require('gulp-concat'),
    uglify = require('gulp-uglify'),
    connect = require('gulp-connect');
    

var paths = {
  'js': {
    in: ['./assets/js/vendors/jquery.js',
        './assets/js/vendors/bootstrap.js',
        './assets/js/vendors/jquery.easing.min.js',
        './assets/js/vendors/jquery.fittext.js',
        './assets/js/vendors/wow.min.js',
        './assets/js/vendors/creative.js',
        './assets/js/scripts/*.js'],
    out: 'scripts.js',
    folderOut: './assets/js/'
  },
  'style': {
    in: ['./assets/scss/*.scss'],
    folderOut: './assets/css/'
  }

};

gulp.task('server:start', function() {
  connect.server({
    port: 8000
  });
  // server close ?
});
 


 
gulp.task('sass:dev', function () {
  gulp.src(paths.style.in)
	.pipe(sourcemaps.init())
	.pipe(sass({includePaths: [ './assets/scss', 
                              '/bower_components/bootstrap-sass/assets/stylesheets/bootstrap/']}))
	// .pipe(sourcemaps.write())
  .pipe(gulp.dest(paths.style.folderOut))
  .pipe(sass.sync().on('error', sass.logError))
  .pipe(livereload());
});
 

gulp.task('sass:build',function () {
  gulp.src(paths.style.in)
    .pipe(sass())
    .pipe(sass.sync().on('error', sass.logError))
    .pipe(minifycss())
    .pipe(gulp.dest(paths.style.folderOut));
});

gulp.task('jsconcat:dev', function() {
  return gulp.src(paths.js.in)
    .pipe(concat(paths.js.out))
    .pipe(gulp.dest(paths.js.folderOut))
    .pipe(livereload());
});

gulp.task('jsconcat:build', function() {
  return gulp.src(paths.js.in)
    .pipe(concat(paths.js.out))
    .pipe(uglify())
    .pipe(gulp.dest(paths.js.folderOut));
});

gulp.task('sass:watch', function () {
  livereload.listen();
  gulp.watch(paths.style.in, ['sass:dev']);
  gulp.watch('./assets/js/**/*.js', ['jsconcat:dev']);
  /* Trigger a live reload on any html changes */
  gulp.watch('*.html').on('change', livereload.changed);
});

gulp.task('serve', ['server:start', 'sass:watch', 'jsconcat:dev'],function () {
});

gulp.task('build', ['sass:build', 'jsconcat:build'],function () {
});

