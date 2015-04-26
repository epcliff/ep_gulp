var gulp = require('gulp'),
    gutil = require('gulp-util'),
    compass = require('gulp-compass'),
    connect = require('gulp-connect'),
    gulpif = require('gulp-if'),
    uglify = require('gulp-uglify'),
    concat = require('gulp-concat');

var env,
    jsSources,
    sassSources,
    htmlSources,
    outputDir,
    sassStyle;

env = process.env.NODE_ENV || 'development';

if(env ==='development') {
    outputDir = 'builds/dev/';
    sassStyle = 'expanded';
} else {
    outputDir = 'builds/prod/';
    sassStyle = 'compressed';
}

jsSources = [
    'resources/scripts/jquery.plugin_name.js',
];

sassSources = ['resources/sass/jquery.plugin_name.sass'];
htmlSources = [outputDir+'*.html'];

gulp.task('js', function(){
    gulp.src(jsSources)
        .pipe(concat('jquery.plugin_name.js'))
        .pipe(gulpif(env === 'production', uglify()))
        .pipe(gulp.dest(outputDir+'js'))
        .pipe(connect.reload())
});

gulp.task('compass', function(){
    gulp.src(sassSources)
        .pipe(compass({
            sass: 'resources/sass',
            image: outputDir+'img',
            style: sassStyle
        })
            .on('error', gutil.log))
        .pipe(gulp.dest(outputDir+'css'))
        .pipe(connect.reload())
});

gulp.task('watch', function(){
    gulp.watch(jsSources, ['js']);
    gulp.watch('resources/sass/*.sass', ['compass']);
    gulp.watch('builds/dev/*.html', ['html']);
});

gulp.task('connect', function(){
    connect.server({
        root: outputDir,
        livereload: true
    });
});

gulp.task('html', function(){
    gulp.src('builds/dev/*.html')
        // .pipe(gulpif(env === 'production', minifyHTML()))
        .pipe(gulpif(env === 'production', gulp.dest( outputDir)))
        .pipe(connect.reload())
});

gulp.task('default', ['html', 'js', 'compass', 'connect', 'watch']);
// EOF