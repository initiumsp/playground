var gulp = require('gulp'),
jshint = require('gulp-jshint'),
order = require("gulp-order"),
uglify = require('gulp-uglify'),
rename = require('gulp-rename'),
concat = require('gulp-concat'),
notify = require('gulp-notify'),
livereload = require('gulp-livereload'),
del = require('del'),
watch = require('gulp-watch');
gulp.task('scripts', function() {
  return gulp.src('js/**/*.js')
    .pipe(jshint('.jshintrc'))
    .pipe(jshint.reporter('default'))
    .pipe(order(["lib/snap.svg-min.js","lib/jquery-1.11.1.min.js","lib/svgLoader.js","lib/jquery.scrollTo.min.js","lib/slick.min.js","lib/masonry.pkgd.min.js","lib/jquery.responsImg.min.js","lib/jquery.colorbox-min.js","all.js"]))
    .pipe(concat('all.js'))
    .pipe(gulp.dest('dist'))
    .pipe(rename({suffix: '.min'}))
    .pipe(uglify())
    .pipe(gulp.dest('dist'))
    .pipe(notify({ message: 'Scripts task complete' }));
});
gulp.task('clean', function() {
  return del(['dist']);
});
gulp.task('default', ['clean'], function() {
  gulp.start('scripts', 'watch');
});
gulp.task('watch', function() {
  gulp.watch('js/**/*.js', ['scripts']);
});