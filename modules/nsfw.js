/// <reference path="../typings/node/node.d.ts"/>
(function () {
    var config = require('../config.js');
    var fs = require('fs');
    var request = require('request');
    var _ = require('lodash');
    var Promise = require("bluebird");
    var URL = require('url');
    var requestPromise = Promise.promisify(request);

    var sendNsfwMedia = function (imgType, imgTypeHost, bot, chatId) {
        var options = {
            url: URL.format({
                protocol: 'http',
                host: 'api.' + imgTypeHost + '.ru',
                pathname: '/' + imgType + '/0/1/random'
            })
        };
        console.log('working with ' + options.url);
        return requestPromise(options)
            .then(function (response) {
                if (response.statusCode == 200) {
                    return JSON.parse(response.body)
                }
                return false;
            }).then(function (imageArray) {
                if (imageArray) {
                    return imageArray[0].preview;
                }
            }).then(function (imagePreview) {
                var url = 'http://media.' + imgTypeHost + '.ru/' + imagePreview.replace('_preview', '');
                return bot.sendPhoto(chatId, url).then(function () {
                            console.log("success sending " + url);
                        });
            })
            .catch(function (e) {
                console.log(e);
                bot.sendMessage(chatId, 'Error');
            });
    };

    module.exports = {
        regex: [/^\/boobs\@?/i, /^\/butts\@?/i, /teta/i, /culo/i],
        proccess: function (message, bot) {
            if(/teta/i.test(message.text)) {
                sendNsfwMedia('boobs', 'oboobs', bot, message.chat.id);
                return;
            }
            if(/culo/i.test(message.text)) {
                sendNsfwMedia('butts', 'obutts', bot, message.chat.id);
                return;
            }
            var imgType = /^\/boobs\@?/i.test(message.text) ? 'boobs' : 'butts';
            var imgTypeHost = /^\/boobs\@?/i.test(message.text) ? 'oboobs' : 'obutts';
            
            bot.sendMessage(message.chat.id, '👀 Ok. let me get that.');
            _.times(5, function () {
                sendNsfwMedia(imgType, imgTypeHost, bot, message.chat.id);
            });
        }
    };
})();
