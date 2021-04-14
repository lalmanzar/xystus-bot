(function () {
  module.exports = {
    regex: [/✋👀/i,/✋️👀/i,/✋🏻👀/i,/✋🏼👀/i,/✋🏽👀/i,/✋🏽👀/i,/✋🏾👀/i,/✋🏿👀/i],
    execute: function (message, bot) {
      return bot.sendMessage(message.chat.id, '✋👀');
    }
  };
})();
