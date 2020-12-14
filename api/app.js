var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');

// REGISTER ROUTERS
const projectsRouter  = require('./routes/projects');
const tasksRouter     = require('./routes/tasks');
const usersRouter     = require('./routes/users');
const utilitiesRouter = require('./routes/utilities');

var app = express();

// APP CONFIG
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());

// ROUTING
app.use('/api/users', usersRouter);
app.use('/api/tasks', tasksRouter);
app.use('/api/projects', projectsRouter);
app.use('/api/utilities', utilitiesRouter);


// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.json({ error: err});
});

module.exports = app;
