var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
var courtsRouter = require('./routes/courts');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

app.use(function (req, res, next) {
  var allowedOrigins = ['http://127.0.0.1:8020','http://ec2-54-186-61-9.us-west-2.compute.amazonaws.com:3010','http://ec2-54-186-61-9.us-west-2.compute.amazonaws.com:3005','http://localhost:4200','https://courtscrap.herokuapp.com', 'https://frontscrap.herokuapp.com','http://localhost:8020', 'http://127.0.0.1:9000', 'http://localhost:9000'];
  var origin = req.headers.origin;
  if(allowedOrigins.indexOf(origin) > -1){
    console.log("allowed")
    res.setHeader('Access-Control-Allow-Origin', origin);
  }
  
  console.log(req.headers.origin)
  // res.header('Access-Control-Allow-Origin', '*');
  // res.setHeader('Access-Control-Allow-Origin', 'https://frontscrap.herokuapp.com');
  res.header('Access-Control-Allow-Headers', true);
  res.header('Access-Control-Allow-Credentials', true);
  res.header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');
  next();
});

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

// app.use(express.static(path.join(__dirname, 'dist')));
app.use('/', express.static(path.join(__dirname, '/dist/ProjectScrap-Frontend')));

// app.use('/', indexRouter);
app.use('/scrape', usersRouter);
app.use('/courts', courtsRouter);
// Send all requests to index.html
app.get('/*', function(req, res) {
  res.sendFile(path.join(__dirname + '/dist/ProjectScrap-Frontend/index.html'));
});

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

module.exports = app;
