/// <reference path="../typings/node/node.d.ts"/>
(function () {
  module.exports = {
    regex: /rocha/i,
    proccess: function (message, bot) {
      bot.sendMessage(message.chat.id, 'rocha 🐢🐢🐢');
    }
  };
})();
