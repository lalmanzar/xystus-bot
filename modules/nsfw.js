/// <reference path="../typings/node/node.d.ts"/>
;(function() {
    var config = require('../config.js')
    var fs = require('fs')
    var _ = require('lodash')
    var Promise = require('bluebird')
    var URL = require('url')
    var requestPromise = Promise.promisify(require('request'))

    var sendNsfwAnimatedMedia = function(imgType, bot, chatId, retries) {
        retries = retries || 0;
        if (imgType !== 'butts') {
            return Promise.resolve(false);
        }
        var options = {
            method: 'POST',
            url: URL.format({
                protocol: config.scrolller.protocol,
                host: config.scrolller.apiUrl,
                pathname: config.scrolller.path,
            }),
        }

        var categories = [
            937,
            945,
            966,
            1023,
            1033,
            1034,
            1040,
            1051,
            1075,
            5101,
            6036,
            7590,
            13532,
            29999,
            448707,
            554685,
            557904,
            585732,
            626993,
            630864,
            631257,
            665350,
            809789,
        ]

        var page = _.random(0, 100) * 2
        var payload = _.map(categories, x => [x, 0, page, 2])
        options.json = payload
        console.log('working with butts gif')
        return requestPromise(options)
            .then(function(response) {
                if (response.statusCode == 200) {
                    return response.body;
                }
                return false
            })
            .then(function(imageArray) {
                if (imageArray) {
                    return _.chain(imageArray)
                        .map(x => x[3])
                        .flatten()
                        .compact()
                        .map(x => x[3])
                        .flatten()
                        .compact()
                        .map(x => x[1])
                        .compact()
                        .map(x =>
                            _.find(
                                x,
                                y =>
                                    (_.isArray(y[0]) &&
                                        _.includes(y[0][1], '.mp4')) ||
                                    _.includes(y[0], '.mp4')
                            )
                        )
                        .compact()
                        .map(x => x[0])
                        .map(x => (_.isArray(x) ? x[1] : x))
                        .compact()
                        .sample()
                        .value()
                }
            })
            .then(function(image) {
                if (!_.includes(image, 'http')) {
                    image = 'https://scrolller.com/media/' + image
                }
                console.log('sending ' + image);
                return bot.sendAnimation(chatId, image).then(function() {
                    console.log('success sending ' + image)
                })
            })
            .catch(function(e) {
                if(retries < 3) {
                    return sendNsfwAnimatedMedia(imgType, bot, chatId, retries + 1);
                } else {
                    bot.sendMessage(chatId, 'Error')
                }
            })
    }

    var sendNsfwMedia = function(imgType, imgTypeHost, bot, chatId) {
        var options = {
            url: URL.format({
                protocol: 'http',
                host: 'api.' + imgTypeHost + '.ru',
                pathname: '/' + imgType + '/0/1/random',
            }),
        }
        console.log('working with ' + options.url)
        return requestPromise(options)
            .then(function(response) {
                if (response.statusCode == 200) {
                    return JSON.parse(response.body)
                }
                return false
            })
            .then(function(imageArray) {
                if (imageArray) {
                    return imageArray[0].preview
                }
            })
            .then(function(imagePreview) {
                var url =
                    'http://media.' +
                    imgTypeHost +
                    '.ru/' +
                    imagePreview.replace('_preview', '')
                return bot.sendPhoto(chatId, url).then(function() {
                    console.log('success sending ' + url)
                })
            })
            .catch(function(e) {
                console.log(e)
                bot.sendMessage(chatId, 'Error')
            })
    }

    module.exports = {
        regex: [/^\/boobs\@?/i, /^\/butts\@?/i, /teta/i, /culo/i],
        proccess: function(message, bot) {
            if (/teta/i.test(message.text)) {
                sendNsfwMedia('boobs', 'oboobs', bot, message.chat.id)
                return
            }
            if (/culo/i.test(message.text)) {
                var randomNum = _.random(0, 100);

                if (randomNum > 90) {
                    sendNsfwAnimatedMedia('butts', bot, message.chat.id);
                } else {
                    sendNsfwMedia('butts', 'obutts', bot, message.chat.id)
                }

                return
            }
            var imgType = /^\/boobs\@?/i.test(message.text) ? 'boobs' : 'butts'
            var imgTypeHost = /^\/boobs\@?/i.test(message.text)
                ? 'oboobs'
                : 'obutts'

            bot.sendMessage(message.chat.id, '👀 Ok. let me get that.')
            sendNsfwAnimatedMedia(imgType, bot, message.chat.id).finally(() =>
                _.times(2, function() {
                    sendNsfwMedia(imgType, imgTypeHost, bot, message.chat.id)
                })
            )
        },
    }
})()
