var express = require('express');
var request = require('request');
var config = require('../config.js');
var debug = require('debug')('indexRoute');
var router = express.Router();
var lastId = -1;
/* GET home page. */
router.get('/', function (req, res, next) {
  res.send('Xystus\' bot says: Hello!');
});

router.get('/me', function (req, res, next) {
  var url = config.telegram.url() + 'getMe';
  debug('requesting url: ' + url);
  request(url, function (error, response, body) {
    res.send(body.result.first_name);
  });
});

router.get('/updates', function (req, res, next) {
  var url = config.telegram.url() + 'getUpdates';
  debug('requesting url: ' + url);
  request(url, function (error, response, body) {
    res.send(body);
  });
});

router.get('/set_webhook', function (req, res, next) {
  var url = config.telegram.url() + 'setWebhook';
  var hookUrl = req.protocol + '://' + req.get('host') + '/webhook';
  debug('requesting url: ' + url);
  
  request(
    {
      url: 'url', //URL to hit
      qs: { url: hookUrl }, //Query string data
      method: 'GET', //Specify the method
    },
    function (error, response, body) {
      res.send(body);
    });
});

router.post('/webhook', function (req, res, next) {
  debug(req.body);
  if(req.body.update_id > lastId){
    lastId = req.body.update_id;
    if(req.body.message.text === '/boobs' || req.body.message.text.indexOf('/boobs ') === 0){
      
    }else if(req.body.message.text === '/butts' || req.body.message.text.indexOf('/butts ') === 0){
      request('http://api.obutts.ru/noise/1', function(error, response, body){
        if(!error && response.statusCode == 200){
          
        }else{
          
        }
      })
    }
    
  }
  res.send('OK');
});

module.exports = router;
