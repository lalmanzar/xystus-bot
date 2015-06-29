(function() {
  var telegram = {
    secretToken: process.env.TELEGRAM_BOT_TOKEN || ''
  };
      
  module.exports = {
    telegram: telegram
  };
})();