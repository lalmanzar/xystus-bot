/// <reference path="../typings/node/node.d.ts"/>
var express = require('express');
var request = require('request');
var config = require('../config.js');
var debug = require('debug')('indexRoute');
var _ = require('lodash');
var Telegram = require('node-telegram-bot-api')

var bot = new Telegram(config.telegram.secretToken, {polling: {
  interval: 500
}});

var pluginsModules = require('require-all')(__dirname + '/../modules');

var router = express.Router();

function endsWith(str, suffix) {
    return str.indexOf(suffix, str.length - suffix.length) !== -1;
}

/* GET home page. */
router.get('/', function (req, res, next) {
  res.send('Xystus\' bot says: Hello!');
});

router.get('/me', function (req, res, next) {
  bot.getMe().then(function (me) {
    res.send('Hi my name is '+ me.first_name +'!');
  }).catch(function() {});
});

router.get('/updates', function (req, res, next) {
  bot.getUpdates().then(function(updates) {
    res.send(updates);
  }).catch(function() {});
});

bot.on('message', function(msg){
  msg = msg.trim();
  if(endsWith(msg, '@XystusBot')){
    msg = msg.slice(0, -10);
  }
  _(pluginsModules).filter(function(plugin){
    return plugin.isSupported(msg);
  }).forEach(function(plugin){
    plugin.proccess(msg, bot);
  }).value();
});

module.exports = router;
