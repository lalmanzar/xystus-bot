(function () {
    var telegram = {
        secretToken: process.env.TELEGRAM_BOT_TOKEN || '',
        options: {
            webHook: {
                port: process.env.TELEGRAM_WEBHOOK_PORT || 443,
                key: __dirname + '/bin/sslcert/server.key',
                cert: __dirname + '/bin/sslcert/server.crt'
            }
        },
        appUrl: process.env.APP_URL || ''
    };

    module.exports = {
        telegram: telegram
    };
})();