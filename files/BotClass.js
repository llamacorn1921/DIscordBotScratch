const { WebSocket } = require("ws");
const EventEmitter = require("events");
const axios = require("axios").default;
const baseURL = "https://discord.com/api/v9/";

/** dog */
let token;





/** discord bot using websockets
 * use 'login' to start;
 */
class Bot extends EventEmitter {
	timestamp;
	intents;
	server;
	/** @type {{heartBeat: number, seq: number}} */
	info = {};

	/** @type {{op: number, event: string, data: object}} */
	payload = {};
	constructor(intents) {
		super();
		this.intents = intents;
		this.timestamp = new Date();

		this.server = new WebSocket(
			"wss://gateway.discord.gg/?v=9&encoding=json"
		);
		this.server.onerror = (err) => {
			console.log(err.message);
		};
		this.server.onopen = (event) => {
			console.log(`[${this.timestamp.toLocaleDateString("en-US", { hour: "2-digit", minute: "2-digit", second: "2-digit" })}] Connected`);
		}
		this.server.onmessage = (event) => {
			let _data = JSON.parse(event.data);
			/** @type {{op: number, event: string, data: object}} */
			console.log(_data)
			if (_data.s !== null) {
				this.info.seq = _data.s;
			}
			this.payload = {
				op: _data.op,
				event: _data.t,
				data: _data.d,
			};
			// console.log(_data.s)
			if (this.payload.op === 10) {
				console.log(`[${this.timestamp.toLocaleDateString("en-US", { hour: "2-digit", minute: "2-digit", second: "2-digit" })}] Sending authentication...`);
				this.info.heartBeat = this.payload.data.heartbeat_interval;
				console.log(`[${this.timestamp.toLocaleDateString("en-US", { hour: "2-digit", minute: "2-digit", second: "2-digit" })}] Heartbeat: ${this.payload.data.heartbeat_interval}`);
				this.send(2, {
					token: token,
					intents: this.intents,
					properties: {
						$os: "linux",
					}
				});
				console.log(`[${this.timestamp.toLocaleDateString("en-US", { hour: "2-digit", minute: "2-digit", second: "2-digit" })}] Authurization sent and done. now starting heart beat`);
				this.heartBeat();
			}
			if (this.payload.op === 11) {
				console.log('Heartbeat came back')
			}
			switch (String(this.payload.event).toLowerCase()) {
				case "ready":
					{
						this.eventReady(this.payload);
					}
					break;
				case "message_create":
					{
						this.eventMessageCreate(this.payload);
					}
					break;
				default:
					// console.log(payload.event)
					break;
			}
		};
	}
	login(t) {
		token = t;
	}

	// guild(ID) {
	// 	var data = get(`/guilds/${ID}`) || {};
	// 	let api = {
	// 		name: data["name"],
	// 	};
	// 	return api;
	// }

	eventReady(data) {
		this.emit("ready", data);
	}
	eventMessageCreate(data) {
		this.emit("message", data);
	}

	heartBeat() {
		setInterval(() => {
			console.log('Sent heatbeat');
			this.send(1, this.info.seq);
		}, this.info.heartBeat);
	}
	send(op, tt) {
		// console.log('==bfdeberasnhbertawq')
		// console.log(tt)
		this.server.send(
			JSON.stringify({
				op: op,
				d: tt
			}), (err) => {
				if (err) {
					console.log(err);
					process.exit();
				}
			}
		);
	}
}
module.exports = Bot;

function get(path) {
	axios({
		baseURL: baseURL,
		url: path,
		method: 'get',
		headers: {
			'Content-Type': 'application/json',
			Authorization:
				`Bot ${token}`,
		},
		
		// data: {
		// 	client_id: 855268197657608213
		// }
	})
		.then((res) => {
			return res.data;
		})
		.catch((err) => {
			console.log(err);
		});
}

// function guild(ID) {
// 	const data = get(`/guilds/${ID}`);
// 	let api = {
// 		name: data.name

// 	}
// 	return api;
// }
