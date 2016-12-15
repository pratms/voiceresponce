var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var mongodb = require('mongodb')
var mongojs = require('mongojs');
var routes = require('./routes/index');
var users = require('./routes/users');
var twilio = require('twilio');

var app = express();


// view engine setup
var db = mongojs('mongodb://pratik:pratik@ds133438.mlab.com:33438/heroku_9rvcpdq9', ['users']);

app.set('views', path.join(__dirname, 'public'));
app.set('view engine', 'ejs');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', routes);
app.post('/voice', (request, response) => 
{
  var twiml = new twilio.TwimlResponse();
  twiml.gather({ 
    finishOnKey:'*',
    numDigits: 5,
    action: '/gather'
    
  }, 
  (gatherNode) => {
    gatherNode.say(' Please enter your 5 digit ID and then press star.');
  });
  twiml.redirect('/voice');

  response.type('text/xml');
  response.send(twiml.toString());
});

app.post('/gather', (request, response) => {
  // Use the Twilio Node.js SDK to build an XML response
  var twiml = new twilio.TwimlResponse();

  // If the user entered digits, process their request
  if (request.body.Digits) {
    twiml.say('wellcome %s to help desk');
    db.users.find({"userid": request.body.Digits}, function(err, data) 
  {
    twiml.say('wellcome %s to help desk', data.name);
     
   });
  }
   else {
    twiml.redirect('/voice');
  }

  // Render the response as XML in reply to the webhook request
  response.type('text/xml');
  response.send(twiml.toString());
});

app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});


if (app.get('env') === 'development') {
  app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
      message: err.message,
      error: err
    });
  });
}


app.use(function(err, req, res, next) {
  res.status(err.status || 500);
  res.render('error', {
    message: err.message,
    error: {}
  });
});


module.exports = app;
