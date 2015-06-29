var express = require('express');
var request = require('request');
var config = require('../config.js');
var debug = require('debug')('indexRoute');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.send('Xystus\' bot says: Hello!');
});

router.get('/me', function(req, res, next) {
  var url = config.telegram.url() + 'getMe';
  debug('requesting url: ' + url);
  request(url, function (error, response, body) {
    res.send(body);
  });
});

module.exports = router;
