var gulp = require('gulp');
var browserify = require('gulp-browserify');

// Basic usage 
gulp.task('bfi', function() {
    // Single entry point to browserify 
    gulp.src('public/scripts/emar.js')
        .pipe(browserify({
            insertGlobals : true,
            debug : true
        }))
        .pipe(gulp.dest('public/scripts/built/'))
});


var sass = require('gulp-sass');

gulp.task('sass', function () {
    return gulp.src('public/styles/**/*.scss')
        .pipe(sass().on('error', sass.logError))
        .pipe(gulp.dest('public/styles/'));
});


gulp.task("build", ["bfi", "sass"]);