'use strict';

// -------------   INIT VAR   ------------------
// 
var gulp = require('gulp');

var sass = require('gulp-sass'),
    sourcemaps = require('gulp-sourcemaps'),
    concat = require('gulp-concat'),
    uglify = require('gulp-uglify'),
    minifycss = require('gulp-minify-css'),
    jade = require('gulp-jade'),
    watch = require('gulp-watch'),
    livereload = require('gulp-livereload'),
    del = require('del'),
    autoprefixer = require('gulp-autoprefixer'),
    rename = require('gulp-rename'),
    connect = require('gulp-connect');

/* imagemin bundles 4 optimizers for compression 
*  (https://github.com/sindresorhus/gulp-imagemin)
*     gifsicle --> GIF images
*     jpegtran --> JPEG images
*     optipng  --> PNG images
*     svgo     --> SVG images
* We will use another PNG optimizer --> pngquant with special options for quality
* (https://www.npmjs.com/package/imagemin-pngquant)
*/ 
var imagemin = require('gulp-imagemin'),
    pngquant = require('imagemin-pngquant');


    
// -------------   PATHS   ------------------
// 
var paths = {
  /* js files */
  'js': {
    input: [
      './bower_components/jquery/dist/jquery.js',
      './bower_components/bootstrap-sass/assets/javascripts/bootstrap.js',
      './bower_components/jquery.easing/js/jquery.easing.js',
      './src/js/vendors/*.js',
      './src/js/custom/*.js',
    ],
    output: {
      file: 'scripts.js',
      folder: './src/js/'
    }
  },
  /* style scss */
  'scss': {
    input: ['./src/styles/**/*.scss', './src/styles/font-awesome/scss/*.scss'],
    output: {
      folder: './src/styles/'
    }
  },
  /* jade files */
  'jadeFiles': {
    templates: [
      './src/**/*.jade'
    ]
  },
  /* html generation */
  'html': {
    srcFolder: './src/',
    srcFiles: './src/**/*.html'
  }

};


//-----------   SERVER   ---------------------
// 
gulp.task('server:start', function() {
  connect.server({
    port: 8000,
    root: './src',
  });
});
 

// ----------   SASS   -----
/* sass DEV */
gulp.task('sass:dev', function () {
  gulp.src(paths.scss.input)
  .pipe(sourcemaps.init())
  .pipe(sass())
  .pipe(gulp.dest(paths.scss.output.folder))
  .pipe(sass.sync().on('error', sass.logError))
  .pipe(livereload());
});
 
/* sass BUILD */
gulp.task('sass:build',function () {
  gulp.src(paths.scss.input)
    .pipe(sass())
    .pipe(sass.sync().on('error', sass.logError))
    .pipe(minifycss())
    .pipe(gulp.dest(paths.scss.output.folder));
});


// ----------   JSCONCAT   -----
/*  js scripts concatenation DEV */
gulp.task('jsconcat:dev', function() {
  return gulp.src(paths.js.input)
    .pipe(concat(paths.js.output.file))
    .pipe(gulp.dest(paths.js.output.folder))
    .pipe(livereload());
});

/* js scripts concatenation BUILD */
gulp.task('jsconcat:build', function() {
  return gulp.src(paths.js.input)
    .pipe(concat(paths.js.output.file))
    .pipe(uglify())
    .pipe(gulp.dest(paths.js.output.folder));
});


//----------- JADE -> HTML -------------------
/* html generation from jade files */
gulp.task('jadeHtml', function() {
  gulp.src(paths.jadeFiles.templates)
    .pipe(jade({
      locals: paths.jadeFiles.templates
    }))
    .pipe(gulp.dest(paths.html.srcFolder))
    .pipe(livereload());
});


//-----------   WATCHERS   ---------------------
/* general watch task */
gulp.task('watch', [
  'watch:sass',
  'watch:js',
  'watch:jadeHtml'
]);

/* SASS */
gulp.task('watch:sass', function () {
  livereload.listen();
  gulp.watch(paths.scss.input, ['sass:dev']);
});

/* JS */
gulp.task('watch:js', function () {
  livereload.listen();
  gulp.watch(paths.js.input, ['jsconcat:dev']);
});

/* JADE -> HTML */
gulp.task('watch:jadeHtml', function () {
  livereload.listen();
  gulp.watch(paths.jadeFiles.templates, ['jadeHtml']);
  /* Trigger a live reload on any html changes */
  gulp.watch(paths.html.srcFiles).on('change', livereload.changed);
});


//-----------   CLEAN   ---------------------
/* Clean 'dist' folder before generating new one with copy task */
gulp.task('cleaning', function () {
  return del([
    'dist/**'
  ]);
});


//-----------   IMAGEMIN   ---------------------

gulp.task('imagemin', function() {
    return gulp.src([
            './src/**/*.png',
            './src/**/*.jpg',
            './src/**/*.svg',
            ])
          .pipe(imagemin({
              progressive: true,
              svgoPlugins: [{removeViewBox: false}],
              use: [pngquant({quality: '65-80', speed: 4})]
          }))
          .pipe(gulp.dest('./dist'));
});


//-----------   COPY   ---------------------
/*  generate a new distribution version */
gulp.task('copy', ['cleaning', 'imagemin'], function() {
  gulp.src([
    './src/**/*.html', 
    './src/**/scripts.js',
    './src/**/style.css',
  ])
  .pipe(gulp.dest('./dist'));
});


// ----------   RUN tasks   ------------------
/* default task (watch & serve) */
gulp.task('serve', ['server:start', 'watch'],function () {
});

/* distribution task */
gulp.task('dist', ['sass:build', 'jsconcat:build', 'jadeHtml', 'copy'],function () {
});
