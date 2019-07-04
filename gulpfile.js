'use strict';
// 追加インストールした機能を呼び出す命令
const gulp = require('gulp');
const sass = require('gulp-sass');
const ejs = require('gulp-ejs');
const rename = require('gulp-rename');
const plumber = require('gulp-plumber');
const autoprefixer = require('gulp-autoprefixer');
const babel = require('gulp-babel');
const browserSync = require('browser-sync');
const reload = browserSync.reload;

gulp.task('sass', function(){
  gulp.src('./src/scss/*.scss')
    .pipe(plumber())
    .pipe(sass({outputStyle : 'expanded'}))
    .pipe(autoprefixer({
      browsers: ['last 2 versions'],
      cascade: false
    }))
    .pipe(gulp.dest('./html/common/css'))
    .pipe(browserSync.reload({stream:true}));
});

gulp.task('babel', function(){
  gulp.src('./src/babel/**/*.es6')
    .pipe(plumber())
    .pipe(babel())
    .pipe(gulp.dest('./html/common/js/'))
    .pipe(browserSync.reload({stream:true}));
});

gulp.task('ejs', function(){
  gulp.src(['./src/ejs/**/*.ejs', '!' + './src/ejs/**/_*.ejs'])
    .pipe(plumber())
    // .pipe(ejs())
      .pipe(ejs({}, {ext: '.html'}))
      // .pipe(rename("index.html"))
    .pipe(gulp.dest('./html'))
    .pipe(browserSync.reload({stream:true}));
});

gulp.task('browser-sync', function(){
  browserSync({
    server: {
      baseDir: './html'
    }
  });
});

gulp.task('default', ['browser-sync'], function(){
  gulp.watch('src/scss/**/*.scss', ['sass']);
  gulp.watch('src/babel/**/*.es6', ['babel']);
  gulp.watch('src/ejs/**/*.ejs', ['ejs']);
});