var express = require('express');
var request = require('request');
var config = require('../config.js');
var debug = require('debug')('indexRoute');
var _ = require('lodash');

var router = express.Router();
var lastId = -1;
var interval;

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
  var url = config.telegram.url() + 'getUpdates';
  debug('requesting url: ' + url);
  request({
    url: url, //URL to hit
    qs: { offset: lastId + 1 }, //Query string data
    method: 'GET', //Specify the method
  }, function (error, response, body) {
      if (res) {
        res.send(body);
      } else {
        var info = JSON.parse(body);
        _(info.result).forEach(function (update) {
          if (update.update_id > lastId) {
            lastId = update.update_id;
            if (update.message.text === '\/boobs' || update.message.text.indexOf('\/boobs ') === 0) {

            } else if (update.message.text === '\/butts' || update.message.text.indexOf('\/butts ') === 0) {
              request('http://api.obutts.ru/noise/1', function (error, response, body) {
                var url = config.telegram.url() + 'sendMessage';
                if (!error && response.statusCode == 200) {
                  var imageArray = JSON.parse(body);
                  var image = imageArray.length > 0 ? 'http://media.oboobs.ru/' + imageArray[0].preview : 'Image error';
                  request(
                    {
                      url: url, //URL to hit
                      qs: {
                        chat_id: update.message.chat.id,
                        text: image
                      }, //Query string data
                      method: 'GET', //Specify the method
                    });
                } else {
                  request(
                    {
                      url: url, //URL to hit
                      qs: {
                        chat_id: update.message.chat.id,
                        text: 'Image Error'
                      }, //Query string data
                      method: 'GET', //Specify the method
                    });
                }
              });
            }
          }
        });
      }
    });
};

router.get('/set_longPolling', function (req, res, next) {
  interval = setInterval(getUpdates, 500);
});

router.get('/stop_longPolling', function (req, res, next) {
  if (interval) {
    clearInterval(interval);
  }
});

module.exports = router;
