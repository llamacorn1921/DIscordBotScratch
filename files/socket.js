const { default: axios } = require('axios');
const { WebSocket } = require("ws");
const config = require("../config.json");

/**
 * @type {{heartbeat: 'heartBeat', seq: 'sequnce number', session_id: 'session_id'}}
 */
let botInfo = {};






const bot = new WebSocket("wss://gateway.discord.gg/?v=9&encoding=json");
// const server = axios.create({
// 	baseURL: `https://www.discord.com`,
// 	headers: {
// 		'Content-Type': 'application/json',
		'Authorization':
			'Bot ODU1MjY4MTk3NjU3NjA4MjEz.YMwAlA.HaEj0X7OkTRl40eYLlM9rj8yFUE',
// 	}
// });
bot.onerror = (e) => {
	console.log(`Error: ${e}`);
};
bot.onopen = (e) => {
	console.log("Connection opened");
};
let auth = {
	op: 2,
	d: {
		token: config.discord.bot.token,
		intents: 513,
		properties: {
			$os: "linux",
			$browser: "chrome",
			$device: "chrome",
		},
		presence: {
			afk: true
		},
	},
};
bot.onmessage = (e) => {
	payload = JSON.parse(e.data);
	code = payload.op;
	trigger = payload.t;
	botInfo.seq = payload.s;
	data = payload.d;
	console.log(payload)
	switch (code) { // on op
		case 10:
			{
				botInfo.heartbeat = data.heartbeat_interval;
				console.log(`Recvied heartbeat: ${botInfo.heartbeat}, Sending auth`);
				bot.send(JSON.stringify(auth));
				startHeartBeat();
			}
			break;
		case 0:
			{
				switch (trigger) {
					case "READY":
						{
							console.log(
								`Bot is now ready.\nSession ID: ${data.session_id}`
							);
							botInfo.session_id = data.session_id;
						}
						break;
					case "MESSAGE_CREATE": {
						console.log(`New message from ${data.author.username}`);
						// bot.
						// console.log(`Guild: ${getGuild(data.guild_id)}`)
					}
					default:
						// console.log(e);
				}
			}
			break;
		case 11: {
			console.log('heartbeat done');
		}
			break;
		default:
			// console.log(e);
	}
}
function startHeartBeat() {
	setInterval(() => {
		bot.send(
			JSON.stringify({
				op: 1,
				d: botInfo.seq,
			})
		);
		console.log("heartbeat send");
	}, botInfo.heartbeat);
}

// function getGuild(ID) {
// 	server.get(`/api/v9/applications/855268197657608213/guilds/963931245992099843`).then((resposne) => {
// 		return resposne;
// 	}).catch((err) => {
// 		console.log(err);
// 	});
// }
