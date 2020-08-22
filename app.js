var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
var allahabadRouter = require('./routes/allahabad');
var andhraPradeshRouter = require('./routes/andhra-pradesh');
var bombayRouter = require('./routes/bombay');
var delhiRouter = require('./routes/delhi');
var calcuttaRouter = require('./routes/calcutta');
var chhattisgarhRouter = require('./routes/chhattisgarh');
var gujratRouter = require('./routes/gujrat');
var himachalPradeshRouter = require('./routes/himachal-pradesh');
var guwahatiRouter = require('./routes/guwahati');
var jammuKashmirRouter = require('./routes/jammu_kashmir');
var jharkhandRouter = require('./routes/jharkhand');
var keralaRouter = require('./routes/kerala');
var karnatakaRouter = require('./routes/karnataka');
var madrasRouter = require('./routes/madras');
var madhyaPradeshRouter = require('./routes/madhya-pradesh');
var manipurRouter = require('./routes/manipur');
var meghalayaRouter = require('./routes/meghalaya');
var orissaRouter = require('./routes/orissa');
var patnaRouter = require('./routes/patna');
var rajasthanRouter = require('./routes/rajasthan');
var rajasthanRouter = require('./routes/rajasthan');
var sikkimRouter = require('./routes/sikkim');
var telanganaRouter = require('./routes/telangana');
var tripuraRouter = require('./routes/tripura');
var uttarakhandRouter = require('./routes/uttarakhand');

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
app.use(express.static(path.join(__dirname, '/public/images')));

// app.use(express.static(path.join(__dirname, 'dist')));
app.use('/', express.static(path.join(__dirname, '/dist/ProjectScrap-Frontend')));

// app.use('/', indexRouter);
app.use('/allahabad', allahabadRouter);
app.use('/andhra-pradesh', andhraPradeshRouter);
app.use('/bombay', bombayRouter);
app.use('/delhi', delhiRouter);
app.use('/calcutta', calcuttaRouter);
app.use('/chhattisgarh', chhattisgarhRouter);
app.use('/gujrat', gujratRouter);
app.use('/guwahati', guwahatiRouter);
app.use('/himachal-pradesh', himachalPradeshRouter);
app.use('/jammu-kashmir', jammuKashmirRouter);
app.use('/jharkhand', jharkhandRouter);
app.use('/karnataka', karnatakaRouter);
app.use('/kerala', keralaRouter);
app.use('/madhya-pradesh', madhyaPradeshRouter);
app.use('/madras', madrasRouter);
app.use('/manipur', manipurRouter);
app.use('/meghalaya', meghalayaRouter);
app.use('/orissa', orissaRouter);
app.use('/patna', patnaRouter);
app.use('/rajasthan', rajasthanRouter);
app.use('/sikkim', sikkimRouter);
app.use('/scrape', usersRouter);
app.use('/scrape', usersRouter);
app.use('/telangana', telanganaRouter);
app.use('/tripura', tripuraRouter);
app.use('/uttarakhand', uttarakhandRouter);
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
