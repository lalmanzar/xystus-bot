/// <reference path="../typings/node/node.d.ts"/>
(function () {
  module.exports = {
    regex: /✋👀/,
    proccess: function (message, bot) {
      bot.sendMessage(message.chat.id, '✋👀');
    }
  };
})();
