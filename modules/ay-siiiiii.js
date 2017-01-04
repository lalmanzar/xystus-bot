/// <reference path="../typings/node/node.d.ts"/>
(function () {
  module.exports = {
    regex: /ay sii/i,
    proccess: function (message, bot) {
      bot.sendVoice(message.chat.id, 'AwADAQADIggAAiwFQAABu-7uk1LdS1EC');
    }
  };
})();
