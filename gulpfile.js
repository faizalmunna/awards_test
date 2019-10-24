const { src, dest, watch, series, parallel } = require('gulp');

const sourcemaps = require('gulp-sourcemaps');
const sass = require('gulp-sass');
const postcss = require('gulp-postcss');
const autoprefixer = require('autoprefixer');
const cssnano = require('cssnano');
const browserSync = require('browser-sync').create();
var replace = require('gulp-replace');

const files = { 
    scssPath: 'app/scss/**/*.scss',
}
function scssTask(){    
    return src(files.scssPath)
        .pipe(sourcemaps.init())
        .pipe(sass()) 
        .pipe(postcss([ autoprefixer(), cssnano() ])) 
        .pipe(sourcemaps.write('.')) 
        .pipe(dest('dist')
    ); 
}
var cbString = new Date().getTime();
function cacheBustTask(){
    return src(['index.html'])
        .pipe(replace(/cb=\d+/g, 'cb=' + cbString))
        .pipe(dest('.'));
}
function watchTask(){
    browserSync.init({
        server:{
            baseDir: './'
        }
    })
    watch([files.scssPath], 
        parallel(scssTask));    
}
exports.default = series(
    parallel(scssTask), 
    cacheBustTask,
    watchTask
);