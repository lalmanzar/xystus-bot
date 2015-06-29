(function() {
  var telegram = {
    baseUrl: 'https://api.telegram.org/bot',
    secretToken: process.env.TELEGRAM_BOT_TOKEN || '',
    url: function () {
      return telegram.baseUrl + telegram.secretToken + '/';
    }
  };
      
  module.exports = {
    telegram: telegram
  };
})();