// Require in needed packages
var gulp = require('gulp');
var sass = require('gulp-sass');
var mustache = require("gulp-mustache");
var sourcemaps = require('gulp-sourcemaps');
var ts = require('gulp-typescript');
var tsProject = ts.createProject('tsconfig.json');

function compileTs(cb) {
    return tsProject.src()
        .pipe(tsProject())
        .js.pipe(gulp.dest('dist/scripts'));
    cb();
}
// Sass compiler
function compileSass(cb) {
    return gulp.src('src/styles/*.scss')
        .pipe(sourcemaps.init())
        .pipe(sass())
        .pipe(sourcemaps.write())
        .pipe(gulp.dest('dist/styles'));
    cb();
}
 
gulp.src("/src/templates/*.mustache")
    .pipe(mustache({
        msg: "Hello Gulp!"
    }))
    .pipe(gulp.dest("./dist"));

// File watcher
function watch(cb) {
    gulp.watch("src/styles/*.scss", compileSass);
    gulp.watch("src/scripts/*.ts", compileTs);
    cb();
}
exports.sass = compileSass;
exports.compileTs = compileTs;
exports.watch = watch;