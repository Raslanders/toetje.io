/**
 * Created by ruudandriessen on 03/02/2017.
 */
'use strict';

var browserify = require('browserify');
var bulkSass = require('gulp-sass-bulk-import');
var clean = require('gulp-clean');
var concat = require('gulp-concat');
var gulp = require('gulp');
var gutil = require('gulp-util');
var inject = require('gulp-inject');
var nunjucks = require('gulp-nunjucks');
var sass = require('gulp-sass');
var source = require('vinyl-source-stream');
var sourcemaps = require('gulp-sourcemaps');

// Remove all build files
gulp.task('clean', function () {
    return gulp.src('www/*/**', {read: false})
        .pipe(clean());
});

// Compile js
gulp.task("js", function () {
    return browserify('src/js/index.js').bundle()
        .on('error', function(error) {
            gutil.log(gutil.colors.red('Error: ' + error.message));
        })
        .pipe(source('app.js'))
        .pipe(gulp.dest('www/'));
});

// Compile sass
gulp.task('sass', function() {
    return gulp.src('src/scss/index.scss')
        .pipe(bulkSass())
        .pipe(sourcemaps.init())
        .pipe(sass().on('error', sass.logError))
        .pipe(concat('style.css'))
        .pipe(sourcemaps.write('sourcemaps/'))
        .pipe(gulp.dest('www/'))
});

// Render html
gulp.task('html', ['js', 'sass'], function() {
    return gulp.src('src/html/index.html')
        .pipe(nunjucks.compile())
        // .pipe(inject(gulp.src(['www/**/*.js', 'www/**/*.css'], {read: false}), {ignorePath: 'www'}))
        .pipe(gulp.dest('www/'))
});

gulp.task('build', ['js', 'sass'], function() {
    gutil.log(gutil.colors.green('Done running build'));
});

gulp.task('default', ['clean', 'build'], function() {});

gulp.task('watch', function() {
    gulp.watch('src/**/*.*', ['build']);
});
