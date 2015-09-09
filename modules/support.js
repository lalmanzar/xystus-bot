/// <reference path="../typings/node/node.d.ts"/>
(function () {
  module.exports = {
    isSupported: function (message) {
      return !!message.text && message.text === '👀✋';
    },
    proccess: function (message, bot) {
      bot.sendMessage(message.chat.id, '👀✋');
    }
  };
})();
