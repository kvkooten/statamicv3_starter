// valet link && valet secure
// add Starter Kit
// yarn install
// gulp cleanup
// gulp build
// gulp sync

// TO DO
// Have Gulp edit layout file so correct assets are loaded
// Have gulp create SCSS dir and file(s)

var gulp          = require('gulp'),
    del           = require('del'),
    sass          = require('gulp-sass'),
    autoprefixer  = require('gulp-autoprefixer'),
    cssnano       = require('gulp-cssnano'),
    rename        = require('gulp-rename'),
    concat        = require('gulp-concat'),
    uglify        = require('gulp-uglify'),
    header        = require('gulp-header'),
    package       = require('./package.json'),
    notify        = require('gulp-notify'),
    browserSync   = require('browser-sync').create();

var deleteFiles   = [
  'webpack.mix.js',
  'public/css/tailwind.css',
  'resources/css/tailwind.css',
]

var sassWatch     = [ "resources/scss/**/*.scss", "resources/scss/**/*.sass" ]
var jsWatch       = [ "resources/js/**/*.js" ]
var htmlWatch     = [ "resources/views/**/*.antlers.html" ]

var siteName      = 'statamicv3';
var userName      = 'kaz';

var banner        = [
  '/*!\n' +
  ' * <%= package.name %>\n' +
  ' * <%= package.title %>\n' +
  ' * <%= package.url %>\n' +
  ' * @author <%= package.author %>\n' +
  ' * @version <%= package.version %>\n' +
  ' * Copyright ' + new Date().getFullYear() + '. <%= package.license %> licensed.\n' +
  ' */',
  '\n'
].join('');



// Clean up project
gulp.task('cleanup', function() {
  return del(deleteFiles);
});



// Compile sass into CSS & auto-inject into browsers
gulp.task('sass', function() {
  return gulp.src("resources/scss/site.scss")
    .pipe(sass())
    .pipe(autoprefixer('last 4 versions'))
    .pipe(header(banner, { package : package }))
    .pipe(gulp.dest("public/css"))

    .pipe(cssnano())
    .pipe(rename({ suffix: '.min' }))
    .pipe(gulp.dest("public/css"))

    .pipe(notify({
      message: "CSS Re-Generated",
    }))

    .pipe(browserSync.stream());
});


// // Compile all JS
// gulp.task('alljs',function(){
//   gulp.src("resources/js/*.js")
//   .pipe(header(banner, { package : package }))
//   .pipe(concat('site.js'))
//   .pipe(gulp.dest("public/js"))
//
//   .pipe(uglify())
//   .pipe(header(banner, { package : package }))
//   .pipe(rename({ suffix: '.min' }))
//   .pipe(gulp.dest("public/js"))
//
//   .pipe(notify({
//     message: "JS files concatenated",
//   }));
// });


// Build Javascript files
gulp.task('js', function() {
  return gulp.src([
    'node_modules/bootstrap/dist/js/bootstrap.bundle.js',
    'resources/js/site_scripts.js'
  ])

  .pipe(header(banner, { package : package }))
  .pipe(concat('site.js'))
  .pipe(gulp.dest('public/js'))

  .pipe(uglify())
  .pipe(header(banner, { package : package }))
  .pipe(rename({ suffix: '.min' }))
  .pipe(gulp.dest('public/js'))

  .pipe(notify({
    message: 'Bootstrap and site_scripts.js concatenated',
  }))
});

// Build assets
gulp.task('build', ['sass', 'js'], function(){
  // Nothing to see here
});

// Static server
gulp.task('sync', ['sass', 'js'], function() {
  browserSync.init({
    proxy: 'https://' + siteName + '.localhost',
    host: siteName + '.localhost',
    open: 'external',
    port: 8000,
    https: {
      key:
      '/Users/' +
      userName +
      '/.config/valet/Certificates/' +
      siteName +
      '.localhost.key',
      cert:
      '/Users/' +
      userName +
      '/.config/valet/Certificates/' +
      siteName +
      '.localhost.crt'
    }
  });

  gulp.watch(sassWatch, ['sass']).on('change', browserSync.reload);
  gulp.watch(jsWatch, ['js']).on('change', browserSync.reload);
  gulp.watch(htmlWatch).on('change', browserSync.reload);
});

gulp.task('default', ['sync']);
