(function () {
  module.exports = {
    regex: /rocha/i,
    execute: function (message, bot) {
      return bot.sendMessage(message.chat.id, 'El Patrón 🐢🐢🐢');
    }
  };
})();
