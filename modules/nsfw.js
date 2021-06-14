(function () {
    const config = require('../config.js');
    const _ = require('lodash');
    const got = require('got');

    const sendNsfwAnimatedMedia = function (imgType, bot, chatId, retries) {
        retries = retries || 0;
        if (imgType !== 'butts') {
            return Promise.resolve(false);
        }
        const url = new URL(config.scrolller.path, `${config.scrolller.protocol}://${config.scrolller.apiUrl}`);

        const categories = [
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
        ];

        const page = _.random(0, 100) * 2;
        const payload = _.map(categories, x => [x, 0, page, 2]);
        console.log('working with butts gif')
        return got.post(url, {
            json: payload,
            responseType: 'json'
        })
            .then(function (response) {
                if (response.statusCode === 200) {
                    return response.body;
                }
                return false
            })
            .then(function (imageArray) {
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
            .then(function (image) {
                if (!_.includes(image, 'http')) {
                    image = `https://scrolller.com/media/${image}`
                }
                console.log('sending ' + image);
                return bot.sendAnimation(chatId, image).then(function () {
                    console.log('success sending ' + image)
                })
            })
            .catch(function (e) {
                if (retries < 3) {
                    return sendNsfwAnimatedMedia(imgType, bot, chatId, retries + 1);
                } else {
                    return bot.sendMessage(chatId, 'Error')
                }
            })
    };

    const sendNsfwMedia = function (imgType, imgTypeHost, bot, chatId) {
        const url = new URL(`/${imgType}/0/1/random`, `http://api.${imgTypeHost}.ru`);
        console.log('working with ' + url)
        return got(url, {
            responseType: 'json'
        })
            .then(function (response) {
                if (response.statusCode === 200) {
                    return response.body;
                }
                return false
            })
            .then(function (imageArray) {
                if (imageArray) {
                    return imageArray[0].preview
                }
            })
            .then(function (imagePreview) {
                var url = `http://media.${imgTypeHost}.ru/${imagePreview.replace('_preview', '')}`
                return bot.sendPhoto(chatId, url).then(function () {
                    console.log('success sending ' + url)
                })
            })
            .catch(function (e) {
                console.log(e)
                return bot.sendMessage(chatId, 'Error')
            })
    };

    module.exports = {
        regex: [/^\/boobs\@?/i, /^\/butts\@?/i, /teta/i, /culo/i],
        execute: function (message, bot) {
            if (/teta/i.test(message.text)) {
                sendNsfwMedia('boobs', 'oboobs', bot, message.chat.id)
            }
            if (/culo/i.test(message.text)) {
                const randomNum = _.random(0, 100);

                if (randomNum > 30) {
                    sendNsfwAnimatedMedia('butts', bot, message.chat.id);
                } else {
                    sendNsfwMedia('butts', 'obutts', bot, message.chat.id)
                }
            }
            if (/teta/i.test(message.text) || /culo/i.test(message.text)) {
                return Promise.resolve(false);
            }
            const imgType = /^\/boobs\@?/i.test(message.text) ? 'boobs' : 'butts';
            const imgTypeHost = /^\/boobs\@?/i.test(message.text)
                ? 'oboobs'
                : 'obutts';

            return bot.sendMessage(message.chat.id, '👀 Ok. let me get that.')
                .then(r =>
                    sendNsfwAnimatedMedia(imgType, bot, message.chat.id).finally(() =>
                        _.times(2, function () {
                            sendNsfwMedia(imgType, imgTypeHost, bot, message.chat.id)
                        })
                    ));
        },
    }
})()
