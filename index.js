const DiscordBot = require('./Bot');




const bot = new DiscordBot(37655, true);


bot.on('ready', (data) => {
	bot.log('Bot: Ready', 'Bot is now read');
	bot.debug('ready', data);
});



bot.login('ODU1MjY4MTk3NjU3NjA4MjEz.YMwAlA.SfQ6buemalLvdf9BZTGiZ84Lsyc')
