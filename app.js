var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var sassMiddleware = require('node-sass-middleware');

var socketio = require('socket.io');
var http = require('http');

var dashboardRouter = require('./routes/dashboard');
var triageRouter = require('./routes/triage');
var patientRouter = require('./routes/patient');
// var usersRouter = require('./routes/users');

var networking = require('./src/networking.js');

var app = express();

const server = http.createServer(app);
const io = socketio(server);

networking.setup(io);

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(sassMiddleware({
  src: path.join(__dirname, 'public'),
  dest: path.join(__dirname, 'public'),
  indentedSyntax: true, // true = .sass and false = .scss
  sourceMap: true
}));
app.use(express.static(path.join(__dirname, 'public')));

app.use('/id', patientRouter);
app.use('/dashboard', dashboardRouter);
app.use('/triage', triageRouter);
// app.use('/users', usersRouter);

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
  res.render('error');
});

const port = process.env.PORT || 8080;
server.listen(port, () => {
  console.log('App started on ' + port);
});

module.exports = app;
