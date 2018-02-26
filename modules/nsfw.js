/// <reference path="../typings/node/node.d.ts"/>
(function () {
    var config = require('../config.js');
    var fs = require('fs');
    var request = require('request');
    var _ = require('lodash');
    var Promise = require("bluebird");
    var URL = require('url');
    var csv = require('node-csvjsonlite');
    var requestPromise = Promise.promisify(request);
    var regexp = /filename=\"(.*)\"/gi;

    function fsExistsSync(myDir) {
        try {
            return fs.existsSync(myDir);
        } catch (e) {
            return false;
        }
    }

    var sendNsfwMedia = function (imgType, bot, chatId) {
        var options = {
            url: URL.format({
                protocol: 'http',
                host: 'api.' + imgType + '.ru',
                pathname: '/noise/1'
            })
        };
        console.log('working with ' + options.url);
        return requestPromise(options)
            .then(function (contents) {
                console.log(contents);
                var response = contents[0];
                return response;
            }).then(function (response) {
                if (response.statusCode == 200) {
                    return JSON.parse(response.body)
                }
                return false;
            }).then(function (imageArray) {
                if (imageArray) {
                    return imageArray[0].preview;
                }
            }).then(function (imagePreview) {
                var url = 'http://media.' + imgType + '.ru/' + imagePreview.replace('_preview', '');
                return requestPromise(url).then(function (contents) {
                    console.log(contents[0].statusCode);
                    if (contents[0].statusCode == 200) {
                        console.log(url);
                        return bot.sendPhoto(chatId, request(url)).then(function () {
                            console.log("success sending " + url);
                        });
                    } else {
                        url = 'http://media.' + imgType + '.ru/' + imagePreview;
                        console.log(url);
                        return bot.sendPhoto(chatId, request(url)).then(function () {
                            console.log("success sending " + url);
                        });
                    }
                });
            })
            .catch(function (e) {
                console.log(e);
                bot.sendMessage(chatId, 'Error');
            });
    };

    module.exports = {
        regex: [/^\/boobs\@?/i, /^\/butts\@?/i],
        proccess: function (message, bot) {
            var imgType = /^\/boobs\@?/i.test(message.text) ? 'oboobs' : 'obutts';
            // if (imgType === 'oboobs' && !_.isEmpty(message.chat.title)) {
            //   bot.sendMessage(message.chat.id, 'If you want boobs ask on a private chat. Boobs are not available for groups.');
            //   return;
            // }
            bot.sendMessage(message.chat.id, '👀 Ok. let me get that.');
            _.times(5, function () {
                sendNsfwMedia(imgType, bot, message.chat.id);
            });
        }
    };
})();
