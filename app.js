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
   db.users.findOne({userid: request.body.Digits }, function(err, data) 
                   
    {
     
  
  if (data) {
    twiml.say('wellcome,'+data.name);

    twiml.gather({ 
    numDigits: 1,
    action: '/gather1'
    
  }, 
  (gatherNode) => {
    gatherNode.say('press 1 for course information, press 2 for grades.');
  });
  twiml.redirect('/voice');
 
  }
   else {
    twiml.redirect('/voice');
  }

  // Render the response as XML in reply to the webhook request
  response.type('text/xml');
  response.send(twiml.toString());
      });
});
app.post('/gather1', (request, response) => {
  // Use the Twilio Node.js SDK to build an XML response
  var twiml = new twilio.TwimlResponse();
  if(request.body.Digits)
{
      switch (request.body.Digits) {
      case '1': 
         twiml.say('Hi there!Please speak your course number,for example cs 641 after the beep -Get ready!')
        .record({
            transcribe: true,
            maxLength:30,
            action:'/recording'
        });

       break;
      case '2': twiml.say('wellcome to course grades!'); break;
      default: 
        twiml.say('Sorry, I don\'t understand that choice.').pause();
        twiml.redirect('/voice');
        break;
    }



} 

   else {
    twiml.redirect('/voice');
  }

  // Render the response as XML in reply to the webhook request
  response.type('text/xml');
  response.send(twiml.toString());
      });


app.post('/recording', (request,response){
var twiml = new twilio.TwimlResponse();
var text = request.body.TranscriptionText;
twiml.say('wellcome to course'+text);
// if(request.body.Digits)
// {
//       switch (request.body.Digits) 
//       {
//       case '2': twiml.say('wellcome to course grades!'); break;
//       default: 
//         twiml.say('Sorry, I don\'t understand that choice.').pause();
//         twiml.redirect('/voice');
//         break;
//     }



// } 

//    else {
//     twiml.redirect('/voice');
//   }

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