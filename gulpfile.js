const gulp   = require('gulp');
const stylus = require('gulp-stylus');

gulp.task('stylus', () => {
  return gulp.src('assets/css/style.styl')
    .pipe(stylus({
      compress: true
    }))
    .pipe(gulp.dest('assets/css/compiled'));
});

gulp.task('watch', () => {
  gulp.watch('assets/css/**/*.styl', ['stylus']);
});

gulp.task('default', ['stylus', 'watch']);