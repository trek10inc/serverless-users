var gulp = require('gulp')
var mocha = require('gulp-mocha')
var eslint = require('gulp-eslint')
var istanbul = require('gulp-istanbul')

var sourceFiles = ['users/**/*.js', '!users/**/node_modules/**/*.js']
var specFiles = ['users/**/*.spec.js', '!users/**/node_modules/**/*.js']
var reportFiles = ['users/**/*.js', '!users/**/*.spec.js', '!users/**/node_modules/**/*.js']

gulp.task('eslint', function () {
  return gulp.src(sourceFiles)
		.pipe(eslint())
		.pipe(eslint.format())
})

gulp.task('pre-test', function () {
  return gulp.src(reportFiles)
		.pipe(istanbul({ includeUntested: true }))
		.pipe(istanbul.hookRequire())
})

gulp.task('test', ['pre-test'], function () {

// gulp.task('test', function () {
  return gulp.src(specFiles)
		.pipe(mocha({ reporter: 'spec' }))
		.pipe(istanbul.writeReports())
})
