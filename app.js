/**
 * app.js - Composition Root
 * Sets up modules and
 * employs error handling.
 */

// General Node/Express Modules
var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var fs = require('fs');

var app = express();

var door = {};
door.uptime = 0;
door.downtime = 0;
var watchdog = setInterval(watchdogBark, 900000);
var uptimePath = '/home/ctag/doorpi-stat/uptime.txt';
var downtimePath = '/home/ctag/doorpi-stat/downtime.txt';

// Read uptime
fs.readFile(uptimePath, "utf8", function(err, data) {
  console.log("Initial Uptime Data: ", data);
  door.uptime = parseInt(data, 10);
});

// Read downtime
fs.readFile(downtimePath, "utf8", function(err, data) {
  console.log("Initial Downtime Data: ", data);
  door.downtime = parseInt(data, 10);
});

function watchdogPet () {
  clearInterval(watchdog);
  door.uptime += 5;
  fs.writeFile(uptimePath, door.uptime, {
    "encoding": "utf8"
  });
  watchdog = setInterval(watchdogBark, 900000);
}

function watchdogBark () {
  door.downtime += 15;
  fs.writeFile(downtimePath, door.downtime, {
    "encoding": "utf8"
  });
}

function timeString (minute) {
  //console.log("Starting with " + minute + "minutes");
  var week, day, hour;
  hour = Math.floor(minute/60);
  minute -= hour*60;
  //console.log(hour + " hours. " + minute + "minutes");
  day = Math.floor(hour/24);
  hour -= day*24;
  //console.log(day + " days. " + hour + "hours");
  week = Math.floor(day/7);
  day -= week*7;
  //console.log(week + " weeks." + day + "days");
  return("["+week+"w - "+day+"d - "+hour+"h:"+minute+"m]");
}

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

//app.use(favicon(__dirname + '/public/favicon.ico'));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

// Instantiate Routes
//var route_index = require('./routes/index')(door);

// Employ Routes
//app.use('/', route_index);
// app.get('/', function(req, res) {
//   console.log("ping");
//   res.send('hi');
// });

app.get('/ping', function(req, res) {
  console.log("/ping");
  watchdogPet();
  res.send("pong");
});

app.get('/check', function (req, res) {
  console.log("/check");
  //var text = "Uptime: " + door.uptime + " min.";
  // var text = "Uptime: " + timeString(door.uptime);
  // text += "\n<br>Downtime: " + timeString(door.downtime);
  // text += "\n<br>Ratio: " + ((door.uptime + door.downtime)/door.uptime);
  // res.send(text);
  var uptimeText = timeString(door.uptime);
  var downtimeText = timeString(door.downtime);
  var ratioText = ((door.uptime + door.downtime)/door.uptime);
  res.render('index', {
    title: 'Check Doorpi Uptime',
    uptime: uptimeText,
    downtime: downtimeText,
    ratio: ratioText
  });
});

//
// error handlers
//

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
  app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
      message: err.message,
      error: err
    });
  });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
  res.status(err.status || 500);
  res.render('error', {
    message: err.message,
    error: {}
  });
});

module.exports = app;
