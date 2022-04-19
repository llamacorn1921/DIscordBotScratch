const DiscordBot = require('./BotClass');

const config = require('./config.json');

const timestamp = new Date();
const bot = new DiscordBot(37655);

bot.on('ready', (data) => {
	console.log(`[${timestamp.toLocaleDateString("en-US", { hour: "2-digit", minute: "2-digit", second: "2-digit" })}] Bot is now online! Session ID: ${data.session_id}`)
});

bot.on('message', (data) => {
	// console.log(data);
	// console.log(bot.guild(963931245992099840).name);
})


bot.login(config.token);
