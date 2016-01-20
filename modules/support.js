/// <reference path="../typings/node/node.d.ts"/>
(function () {
  module.exports = {
    regex: /✋👀/i,
    proccess: function (message, bot) {
      bot.sendMessage(message.chat.id, '✋👀');
    }
  };
})();
