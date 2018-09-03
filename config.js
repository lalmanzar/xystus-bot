(function () {
    var telegram = {
        secretToken: process.env.TELEGRAM_BOT_TOKEN || '',
        options: {
            webHook: {
                port: process.env.TELEGRAM_WEBHOOK_PORT || 443,
                key: (process.env.CERTIFICATE_PATH || (__dirname + '/bin/sslcert')) + '/key.pem',
                cert: (process.env.CERTIFICATE_PATH || (__dirname + '/bin/sslcert')) + '/crt.pem'
            }
        },
        appUrl: process.env.APP_URL || ''
    };
    var endpointSources = {
        eporner: process.env.EPORNER || '' 
    };

    module.exports = {
        telegram: telegram,
        endpointSources: endpointSources
    };
})();
