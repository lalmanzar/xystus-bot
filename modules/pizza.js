(function () {
  var _ = require('lodash');

  var pizzaQuotes = [
    'There’s no better feeling in the world than a warm pizza box on your lap.',
    'I just want to be in my sweats, walk my dog, watch TV and eat pizza.',
    'The perfect lover is one who turns into a pizza at 4:00 a.m.',
    'I make myself pizza if it comes down to that drastic measurement.',
    'And I don’t cook, either. Not as long as they still deliver pizza.',
    'I think of dieting, then I eat pizza.',
    'Everybody likes pizza!',
    'Those pizzas I ate were for medicinal purposes.',
    'A wise man once said, ‘Forgiveness is divine, but never pay full price for late pizza.’',
    'Pizza is my copilot!',
    'Pizza!',
    'Ok guys, where is the pizza?',
    'Why did the hipster burn his lips? He ate his pizza before it was cool.',
    'Pizza is my copilot!',
    'Pizza is my spirit animal!',
    'Pepperoni for me, please!',
    'gotPizza?',
    'In Pizza we trust!',
    'while(pizza) happiness++;',
    'Abra-ca-pizza!!!'
  ];

  module.exports = {
    regex: /pizza/i,
    execute: function (message, bot) {
      return bot.sendMessage(message.chat.id, _.sample(pizzaQuotes).concat(' 🍕😄'));
    }
  };
})();
