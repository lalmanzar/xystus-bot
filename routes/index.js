var express = require('express');
var request = require('request');
var config = require('../config.js');
var debug = require('debug')('indexRoute');
var _ = require('lodash');

var router = express.Router();
var lastId = -1;
var interval = setInterval(getUpdates, 500);

/* GET home page. */
router.get('/', function (req, res, next) {
  res.send('Xystus\' bot says: Hello!');
});

router.get('/me', function (req, res, next) {
  var url = config.telegram.url() + 'getMe';
  debug('requesting url: ' + url);
  request(url, function (error, response, body) {
    var info = JSON.parse(body);
    res.send(info.result.first_name);
  });
});

router.get('/updates', function (req, res, next) {
  getUpdates(res);
});

var getUpdates = function (res) {
  var getUpdatesUrl = config.telegram.url() + 'getUpdates';
  debug('requesting url: ' + getUpdatesUrl);
  debug('lastId: ' + lastId);
  request({
    url: getUpdatesUrl, //URL to hit
    qs: { offset: lastId + 1 }, //Query string data
    method: 'GET', //Specify the method
  }, function (error, response, body) {
      var url = config.telegram.url() + 'sendMessage';
      debug(res);
      if (res) {
        res.send(body);
      } else {
        var info = JSON.parse(body);
        debug(info);
        _.forEach(info.result, function (update) {
          debug("updateID: " + update.update_id);
          if (update.update_id > lastId && !!update.message.text) {
            lastId = update.update_id;
            var sendMessageCallback = function (msg) {
              debug(msg);
              request(
                {
                  url: url, //URL to hit
                  qs: {
                    chat_id: update.message.chat.id,
                    text: msg
                  }, //Query string data
                  method: 'GET', //Specify the method
                });
            };
            if (update.message.text === '\/boobs' || update.message.text.indexOf('\/boobs ') === 0) {
              _.times(5, function(){
                sendNsfwMedia('oboobs', sendMessageCallback);
              });
            } else if (update.message.text === '\/butts' || update.message.text.indexOf('\/butts ') === 0) {
              _.times(5, function(){
                sendNsfwMedia('obutts', sendMessageCallback);
              });
            }
          }
        });
      }
    });
};

var sendNsfwMedia = function (imgType, callback) {
  debug(imgType);
  request('http://api.' + imgType + '.ru/noise/1', function (error, response, body) {
    debug(body);
    if (!error && response.statusCode == 200) {
      var imageArray = JSON.parse(body);
      var image = imageArray.length > 0 ? 'http://media.' + imgType + '.ru/' + imageArray[0].preview : 'Image Error';
      callback(image)
    } else {
      callback('Image Error');
    }
  });
};

router.get('/set_longPolling', function (req, res, next) {
  interval = setInterval(getUpdates, 500);
  res.send('started Long Polling');
});

router.get('/stop_longPolling', function (req, res, next) {
  if (interval) {
    clearInterval(interval);
    res.send('Stopped Long Polling');
  }
});
module.exports = router;
