(function () {
  module.exports = {
    regex: /party/i,
    execute: function (message, bot) {
      return bot.sendDocument(message.chat.id, __dirname+'/../assets/party.gif');
    }
  };
})();
