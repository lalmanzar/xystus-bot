(function () {
  module.exports = {
    regex: /ay sii/i,
    execute: function (message, bot) {
      return bot.sendVoice(message.chat.id, 'AwADAQADIggAAiwFQAABu-7uk1LdS1EC');
    }
  };
})();
