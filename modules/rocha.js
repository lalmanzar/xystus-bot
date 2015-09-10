/// <reference path="../typings/node/node.d.ts"/>
(function () {
  module.exports = {
    isSupported: function (message) {
      return !!message.text && message.text.toLowerCase().indexOf('rocha') >= 0;
    },
    proccess: function (message, bot) {
      bot.sendMessage(message.chat.id, 'rocha 🐢🐢🐢');
    }
  };
})();
