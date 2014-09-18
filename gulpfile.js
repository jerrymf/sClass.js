var gulp = require("gulp");

var gulpJSHint = require("gulp-jshint");
var gulpUglify = require("gulp-uglify");
var gulpRename = require("gulp-rename");
var gulpSavefile = require("gulp-savefile");

var karma = require("karma").server;

// Lint Task
gulp.task("lint", function() {

    return gulp.src("index.js")
        .pipe(gulpJSHint())
        .pipe(gulpJSHint.reporter("default"));

});

// minification by Uglify
gulp.task("minify", function() {

    return gulp.src("index.js")
        .pipe(gulpUglify())
        .pipe(gulpRename("index.min.js"))
        .pipe(gulpSavefile());

});

// run tests
gulp.task("test", function (done) {

    karma.start({
        configFile: __dirname + "/karma.conf.js",
        singleRun: true
    }, done);

});

gulp.task("default", ["lint", "minify", "test"]);