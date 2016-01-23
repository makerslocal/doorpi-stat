/**
 * index.js - Serve webpages
 * This module will handle requests
 * associated with webpages on the
 * site. Nothing more.
 */

// Requirements
var express = require('express');
var router = express.Router();
var path = require('path');

function Route (door) {

  router.get('/ping', function(req, res) {
    console.log("/ping");
    door.watchdogPet();
  });

  router.get('/check', function (req, res) {
    console.log("/check");
    res.send("Uptime: " + door.uptime + " min. \nDowntime: " + door.downtime + " min.");
  });

  return(router);
}

module.exports = Route;
