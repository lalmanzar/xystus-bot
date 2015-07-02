/// <reference path="../typings/node/node.d.ts"/>
(function () {
  var request = require('request');
  var _ = require('lodash');
  var Promise = require("bluebird");
  var request = require("request");
  var URL = require('url');
  var requestPromise = Promise.promisify(request);

  var sendNsfwMedia = function (imgType, bot, chatId) {
    var options = {
      url: URL.format({
        protocol: 'http',
        host: 'api.' + imgType + '.ru',
        pathname: '/noise/1'
      })
    };
    return requestPromise(options).then(function (contents) {
      var response = contents[0];
      if (response.statusCode == 200) {
        
        var imageArray = JSON.parse(response.body);
        if (imageArray.length > 0) {
          var imagename = imageArray[0].preview.replace('_preview', '');
          var url = 'http://media.' + imgType + '.ru/' + imagename;
          var image = request(url);
          return bot.sendPhoto(chatId, image).catch(function (e) {
            console.log(e);
          });
        }
      }
    }).catch(function (error) {
      return bot.sendMessage(chatId, 'Image Error').catch(function () { });
    });
  };

  module.exports = {
    isSupported: function (message) {
      return !!message.text && (message.text === '\/boobs' || message.text.indexOf('\/boobs ') === 0 || message.text === '\/butts' || message.text.indexOf('\/butts ') === 0);
    },
    proccess: function (message, bot) {
      var imgType = message.text.indexOf('\/boobs') === 0 ? 'oboobs' : 'obutts';
      var promise = sendNsfwMedia(imgType, bot, message.chat.id);
      _.times(4, function () {
        promise = promise.finally(function () {
          return sendNsfwMedia(imgType, bot, message.chat.id);
        });
      });
    }
  };
})();