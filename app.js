var express = require('express');
var logger = require('morgan');
var bodyParser = require('body-parser');
var config = require('./config.js');
var TelegramBot = require('node-telegram-bot-api')
var _ = require('lodash');
var pluginsModules = require('require-all')(__dirname + '/modules');

var bot = new TelegramBot(config.telegram.secretToken, config.telegram.options);
bot.setWebHook(config.telegram.appUrl + '/' + config.telegram.secretToken, {
  certificate: config.telegram.options.webHook.cert,
});

_.forEach(pluginsModules, function(plugin){
    if(_.isArray(plugin.regex)){
        _.forEach(plugin.regex, function(regex){
            bot.onText(regex, function (msg, match) {
                plugin.proccess(msg, bot)
            });
        });
    }else if(_.isRegExp(plugin.regex)){
        bot.onText(plugin.regex, function (msg, match) {
            plugin.proccess(msg, bot)
        });
    }
  });

var app = express();

// uncomment after placing your favicon in /public
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));


app.get('/', function (req, res, next) {
  res.send('Xystus\' bot says: Hello!');
});

app.get('/me', function (req, res, next) {
  bot.getMe().then(function (me) {
    res.send('Hi my name is '+ me.first_name +'!');
  }).catch(function() {});
});

// catch 404 and forward to error handler
app.use(function(req, res, next) {
    res.send('Not Found');
});

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
  res.status(err.status || 500);
  res.send('Internal Server Error');
});


module.exports = app;
