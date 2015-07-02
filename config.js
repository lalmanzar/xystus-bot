(function() {
  var telegram = {
    secretToken: process.env.TELEGRAM_BOT_TOKEN || '122832832:AAEMn__woXrKYXmKMKaDlCYMYSKz_VrQhh4'
  };
      
  module.exports = {
    telegram: telegram
  };
})();