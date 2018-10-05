(function () {
    var telegram = {
        secretToken: process.env.TELEGRAM_BOT_TOKEN || '',
        appUrl: process.env.APP_URL || ''
    };

    module.exports = {
        telegram: telegram,
    };
})();
