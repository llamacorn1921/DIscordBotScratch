const axios = require("axios");

// const config = require("./config.json");

const bot = axios.create({
	// baseURL: `https://discord.com/api/v9`,
	baseURL: 'wss://gateway.discord.gg',
	timeout: 10000,
	headers: {
		'Content-Type': 'application/json',
		'Authorization':
			"Bot ODU1MjY4MTk3NjU3NjA4MjEz.YMwAlA.HaEj0X7OkTRl40eYLlM9rj8yFUE",
	},
});
bot.request({
	url: `/v=9&encoding=json`,
	method: "post"
}).then((res) => {
	console.log(res)
})
