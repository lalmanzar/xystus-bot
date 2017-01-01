/// <reference path="../typings/node/node.d.ts"/>
(function () {
  module.exports = {
    regex: /party/i,
    proccess: function (message, bot) {
      bot.sendDocument(message.chat.id, 'http://i.giphy.com/Z8boag4fqS03S.gif').catch(function(){
        bot.sendDocument(message.chat.id, __dirname+'/../assets/party.gif');
      });
    }
  };
})();
