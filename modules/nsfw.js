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
            fs.accessSync(myDir);
            return true;
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

    var sendRandomNsfwMedia = function (bot, chatId) {

        var url = config.endpointSources.eporner;
        console.log('Getting:' + url);
        new Promise(function (resolve, reject) {
            request.get(url)
                .on('response', function (response) {
                    console.log(response.statusCode)
                    console.log(response.headers['content-type'])
                    if (response.headers['content-type'] === 'text/csv') {
                        var filename = regexp.exec(response.headers['content-disposition'])[1];
                        console.log(filename);
                        if (fsExistsSync(filename)) {
                            console.log(filename + " already exists");
                            resolve(filename);
                        }
                        else {
                            console.log("downloading file " + filename);
                            response
                                .pipe(fs.createWriteStream(filename))
                                .on('error', reject)
                                .on('close', function () {
                                    resolve(filename);
                                });
                        }
                    } else {
                        console.log(response);
                        console.debug(response);
                        reject(response.statusCode + ": " + response.body);
                    }

                });
        })
            .then(function (filename) {
                console.log("downloaded csv");
                return filename;
            })
            .then(function (filepath) {
                console.log("converting to json");
                return csv
                    .convertFile(filepath);
            })
            .then(function (successData) {
                console.log("convertion completed.");
                console.log("Total images: " + successData.length);
                var images = _.sampleSize(successData, 5);
                _.forEach(images, function (image) {
                    console.log('Sending: ' + image.image);
                    bot.sendPhoto(chatId, request(image.image))
                });
            })
            .catch(function (e) {
                console.log(e);
                bot.sendMessage(chatId, 'Error');
            });

    };

    module.exports = {
        regex: [/^\/boobs\@?/i, /^\/butts\@?/i, /^\/random\@?/i],
        proccess: function (message, bot) {
            var imgType = message.text.indexOf('\/boobs') === 0 ? 'oboobs' : message.text.indexOf('\/butts') === 0 ? 'obutts' : 'random';
            // if (imgType === 'oboobs' && !_.isEmpty(message.chat.title)) {
            //   bot.sendMessage(message.chat.id, 'If you want boobs ask on a private chat. Boobs are not available for groups.');
            //   return;
            // }
            if (imgType === 'random') {
                sendRandomNsfwMedia(bot, message.chat.id);
                return;
            }
            bot.sendMessage(message.chat.id, '👀 Ok. let me get that.');
            _.times(5, function () {
                sendNsfwMedia(imgType, bot, message.chat.id);
            });
        }
    };
})();
