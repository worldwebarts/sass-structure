'use strict';

/////////////////////////////////////////////////////////////////////////////
// GULP PLUGINS
var gulp = require('gulp'),
    watch = require('gulp-watch'),
    autoprefix = require('gulp-autoprefixer'),
    sass = require('gulp-sass'),
    rename = require('gulp-rename'),
    concat = require('gulp-concat'),
    uglify = require('gulp-uglify'),
    rigger = require('gulp-rigger'),
    ignore = require('gulp-ignore'),
    minifyCss = require('gulp-clean-css'),
    
    // jshint = require('gulp-jshint'),
    imagemin = require('gulp-imagemin'),
    htmlmin = require('gulp-htmlmin'),
    minifyjs = require('gulp-js-minify'),
    refresh = require('gulp-livereload'),
    
    notify = require('gulp-notify'),
    plumber = require('gulp-plumber'),
    gutil = require('gulp-util'),
    
    rimraf = require('rimraf'),
    browserSync = require("browser-sync"),
    
    reload = browserSync.reload;
    



/////////////////////////////////////////////////////////////////////////////
// GULP PATHS
var path = {
    src: {
        images: 'src/images/**/*.*',
        fonts: 'src/fonts/**/*.*',
        styles: 'src/styles/**/*.scss',
        scripts: 'src/scripts/**/*.*'
        // vendors_bower: 'src/vendors/bower/**/*.*',
        // vendors_manual: 'src/vendors/manual/**/*.*'
    },
    build: {
        images: 'assets/images/',
        fonts: 'assets/fonts/',
        styles: 'assets/styles',
        cssSource: 'assets/styles/source',
        scripts: 'assets/scripts'
        // vendors: 'assets/vendors'
    },
    watch: {
        images: 'src/images/**/*.*',
        fonts: 'src/fonts/**/*.*',
        styles: 'src/styles/**/*.scss',
        scripts: 'src/scripts/**/*.*'
        // vendors: 'src/vendors/**/*.*'
    },
    clean: 'assets'
};



/////////////////////////////////////////////////////////////////////////////
// PRINT ERRORS



function printError(error) {
    console.log(error.toString());
    this.emit('end');
}



/////////////////////////////////////////////////////////////////////////////
// BROWSERSYNC SERVE
var config = {
    server: {
        baseDir: "./assets"
    },
    files: ['./assets/**/*'],
    tunnel: false,
    host: 'localhost',
    port: 9000,
    logPrefix: "frontend",
    watchTask: true
};

// gulp.task('serve', function () {
//     setTimeout(function () {
//         browserSync(config);
//     }, 5000)
// });




/////////////////////////////////////////////////////////////////////////////
// VENDORS BUILD
// gulp.task('vendors:bower:build', function() {
 //   return gulp.src(path.src.vendors_bower)
 //       .pipe(gulp.dest(path.build.vendors))
// });
// gulp.task('vendors:manual:build', function() {
//    return gulp.src(path.src.vendors_manual)
 //       .pipe(gulp.dest(path.build.vendors))
// });



/////////////////////////////////////////////////////////////////////////////
// JAVASCRIPT BUILD
gulp.task('scripts:build', function () {
    return gulp.src(path.src.scripts)
        .pipe(gulp.dest(path.build.scripts))
        .pipe(reload({stream: true}));
});


/////////////////////////////////////////////////////////////////////////////
// STYLES BUILD
gulp.task('styles:build', function () {
    return gulp.src(path.src.styles)
        .pipe(sass({outputStyle: 'expanded', indentWidth: 4}))
        .on('error', printError)
        .pipe(autoprefix({
            browsers: ['last 30 versions', '> 1%', 'ie 9'],
            cascade: true
        }))
        .pipe(ignore.exclude('mixins.css'))
        .pipe(gulp.dest(path.build.cssSource))
        .pipe(ignore.exclude('main.css'))
        .pipe(minifyCss())
        .pipe(concat('main.css'))
        .pipe(rename({ extname: '.min.css' }))
        .pipe(gulp.dest(path.build.styles))
        .pipe(reload({stream: true}))
});



/////////////////////////////////////////////////////////////////////////////
// IMAGES BUILD

gulp.task('images:build', function (cb) {
    gulp.src(path.src.images)
        .pipe(imagemin({
            optimizationLevel: 5,
            progressive: true,
            interlaced: true
        }))
        .on('error', printError)
        .pipe(gulp.dest(path.build.images))
        .on('end', cb)
});



/////////////////////////////////////////////////////////////////////////////
// FONTS BUILD
gulp.task('fonts:build', function() {
    return gulp.src(path.src.fonts)
		.pipe(gulp.dest(path.build.fonts))
});



/////////////////////////////////////////////////////////////////////////////
// BUILD ALL
gulp.task('build', [
    'fonts:build',
    'images:build',
    'styles:build',
    'scripts:build'
    //'vendors:bower:build',
   // 'vendors:manual:build'
]);


/////////////////////////////////////////////////////////////////////////////
// WATCH ALL
gulp.task('watch', function(){
    watch([path.watch.images], function(event, cb) {
    gulp.start('images:build');
    });
    watch([path.watch.fonts], function(event, cb) {
        gulp.start('fonts:build');
    });
    watch([path.watch.styles], function(event, cb) {
        gulp.start('styles:build');
    });
    watch([path.watch.scripts], function(event, cb) {
        gulp.start('scripts:build');
    });
   // watch([path.watch.vendors], function(event, cb) {
  //      gulp.start('vendors:bower:build');
   //     gulp.start('vendors:manual:build');
   // });
});



/////////////////////////////////////////////////////////////////////////////
// CLEAN PRODUCTION
gulp.task('clean', function (cb) {
    rimraf(path.clean, cb);
});



/////////////////////////////////////////////////////////////////////////////
// DEFAULT TASK
gulp.task('default', ['build', 'watch']);