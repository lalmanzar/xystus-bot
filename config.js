(function () {
    var telegram = {
        secretToken: process.env.TELEGRAM_BOT_TOKEN || '',
        options: {
            webHook: {
                port: process.env.TELEGRAM_WEBHOOK_PORT || 443,
                key: __dirname + '/bin/sslcert/private.key',
                cert: __dirname + '/bin/sslcert/public.pem'
            }
        },
        appUrl: process.env.APP_URL || ''
    };

    module.exports = {
        telegram: telegram
    };
})();