var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var request = require('request');

var index = require('./routes/index');
var signUp = require('./routes/signUp');
var login = require('./routes/login');
var profile = require('./routes/profile');
var setting = require('./routes/setting');

var graphqlHTTP = require('./routes/graphqlHTTP');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', index);
app.use('/signUp', signUp);
app.use('/login', login);
app.use('/profile', profile);
app.use('/setting', setting);
app.use('/graphql', graphqlHTTP);

// ESP32
app.get('/esp32/door', function(req, res, next) {
	request('http://192.168.1.193/door', function (error, response, body) {
		console.error('esp32-error:', error); // Print the error if one occurred
		console.log('esp32-statusCode:', response && response.statusCode); // Print the response status code if a response was received
		res.send(body);
	});
});
app.get('/esp32/door/unlock', function(req, res, next) {
	request('http://192.168.1.193/door/unlock', function (error, response, body) {
		console.error('esp32-error:', error); // Print the error if one occurred
		console.log('esp32-statusCode:', response && response.statusCode); // Print the response status code if a response was received
		res.send(body);
	});
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
