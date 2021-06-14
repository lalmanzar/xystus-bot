const config = require('./config.js');
const _ = require('lodash');
const pluginsModules = require('require-all')(__dirname + '/modules');

const TelegramBot = require('node-telegram-bot-api');
const options = {
    webHook: {
        port: 443,
    }
};
const bot = new TelegramBot(config.telegram.secretToken, options);

bot.setWebHook(`https://${config.telegram.appUrl}/bot${config.telegram.secretToken}`)
    .then(() =>
        _.forEach(pluginsModules, function (plugin) {
            if (_.isArray(plugin.regex)) {
                _.forEach(plugin.regex, function (regex) {
                    bot.onText(regex, function (msg) {
                        plugin.execute(msg, bot, regex);
                    });
                });
            } else if (_.isRegExp(plugin.regex)) {
                bot.onText(plugin.regex, function (msg) {
                    plugin.execute(msg, bot);
                });
            }
        })
    );
