const { WebSocket } = require("ws");
const EventEmitter = require("events");
const axios = require("axios").default;
// const { WebSocket } = require("ws");
// const EventEmitter = require("events");

/** discord bot using websockets
 * use 'login' to start;
 */

class Bot extends EventEmitter {
	token;
	intents;
	server;
	/** @type {{heartBeat: number, seq: number}} */
	info;

	/** @type {{op: number, event: string, data: object}} */
	payload = {};
	constructor(intents) {
		super();
		this.intents = intents;

		this.server = new WebSocket(
			"wss://gateway.discord.gg/?v=9&encoding=json"
		);
		this.server.onerror = (err) => {
			console.log(err.message);
		};
		this.server.onmessage = (event) => {
			/** @type {{op: number, event: string, data: object}} */
			payload = JSON.parse(event.data);
			if (this.payload.op === 10) {
				console.log(`[DEBUG] Sending authentication...`);
				this.send(2, {
					token: this.token,
					intents: this.intents,
					properties: {
						$os: "linux",
						$browser: "chrome",
						$device: "chrome",
					},
				});
			}
			switch (this.payload.event.toLowerCase()) {
				case "ready":
					{
						this.eventCalls.ready(data);
					}
					break;
				case "message_create":
					{
						this.eventCalls.message(data);
					}
					break;
				default:
					break;
			}
		};
	}
	login(token) {
		this.token = token;
	}

    guilds (ID) {
        data = this.request(`/guilds/${ ID }`, 'get');
        api = {
            get (value) {
                return data[value];
            }
        }
    }

	eventCalls = {
		ready(data) {
			this.emit("ready", data);
		},
		message(paylaod) {
			this.emit("message", data);
		},
	};

	heartBeat() {
		setInterval(() => {
			this.send(1, this.info.seq);
		}, this.info.heartBeat);
	}
	request(path, type, data = null) {
        axios({
            baseURL: "https://discord.com/api/v9/",
            url: `${ path }`,
            method: `${ type }`,
            headers: {
                Authorization:
                    `Bot ${ this.token }`,
            },
            data: data
        }).then((res) => {
            return res.data;
        }).catch((err) => {
            console.log(err);
        });
	}
	send(op, data) {
		this.server.send(
			JSON.stringify({
				op: op,
				d: _data,
			})
		);
	}
}
module.exports = Bot;
