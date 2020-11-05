(function () {
    var telegram = {
        secretToken: process.env.TELEGRAM_BOT_TOKEN || '',
        appUrl: process.env.APP_URL || ''
    };

    var scrolller = {
        apiUrl: process.env.SCROLLLER_API_URL || 'old.scrolller.com',
        protocol: process.env.SCROLLLER_API_PROTOCOL || 'http',
        path: process.env.SCROLLLER_API_PATH || '/api/gifs'
    };
    module.exports = {
        telegram: telegram,
        scrolller: scrolller
    };
})();
