/// <reference path="../typings/node/node.d.ts"/>
(function () {
  var request = require('request');
  var _ = require('lodash');
  var Promise = require("bluebird");
  var URL = require('url');
  var requestPromise = Promise.promisify(request);

  var sendNsfwMedia = function (imgType, bot, chatId, count) {
    count = count || 1;
    if(count > 3){
      return;
    }
    var options = {
      url: URL.format({
        protocol: 'http',
        host: 'api.' + imgType + '.ru',
        pathname: '/noise/1'
      })
    };
    console.log('working with ' + options.url);
    return requestPromise(options).then(function (contents) {
      var response = contents[0];
      if (response.statusCode == 200) {
        
        var imageArray = JSON.parse(response.body);
        if (imageArray.length > 0) {
          //var imagename = imageArray[0].preview.replace('_preview', '');
          var imagename = imageArray[0].preview;
          var url = 'http://media.' + imgType + '.ru/' + imagename;
          console.log(url);
          var image = request(url);
          return bot.sendPhoto(chatId, image).then(function(){
            console.log("success sending "+ url);
          }).catch(function (e) {
            console.log(e);
            return sendNsfwMedia(imgType, bot, chatId, count + 1);
          });
        }
      }else {
        bot.sendMessage(chatId, 'Error With api. Error code: ' + response.statusCode);
      }
    }).catch(function (error) {
      console.log(error);
      return sendNsfwMedia(imgType, bot, chatId, count + 1);
    });
  };

  module.exports = {
    isSupported: function (message) {
      return !!message.text && (message.text === '\/boobs' || message.text.indexOf('\/boobs ') === 0 || message.text === '\/butts' || message.text.indexOf('\/butts ') === 0);
    },
    proccess: function (message, bot) {
      var imgType = message.text.indexOf('\/boobs') === 0 ? 'oboobs' : 'obutts';
      bot.sendMessage(message.chat.id, '👀 Ok. let me get that.');
      var promise = sendNsfwMedia(imgType, bot, message.chat.id);
      _.times(4, function () {
        promise = promise.finally(function () {
          return sendNsfwMedia(imgType, bot, message.chat.id);
        });
      });
    }
  };
})();
