// const {WebSocket} = require('ws');
const EventsEmitter = require("events");
const axios = requie("axios").default;

/** bot token */
let token;



class Bot extends EventsEmitter {
	debug;
	intents;
	server;

	/** @type {{heartBeat: number, seq: number}} */
	info = {};

	/** @type {{op: number, event: string, data: object}} */
	payload = {};

	constructor(intents, debug = false) {
		super();
		this.intents = intents;

		this.server = new WebSocket(
			"wss://gateway.discord.gg/?v=9&encoding=json"
		);

		this.server.onerror = (err) => {
			console.log(`Web Socket Error: ${err}`);
		};
		this.server.onopen = (event) => {
			console.log("Bot connected to discord");
		};
		this.server.onmessage = (event) => {
			let _data = JSON.parse(event.data); // break into data chunk
			if (_data.s !== null) {
				this.info.seq = _data.s;
			}
			this.payload = {
				op: _data.op,
				event: _data.t,
				data: _data.d,
			};

			switch (this.payload.op) {
				case 10:
					{
						this.info.heartBeat =
							this.payload.data.heartbeat_interval;
						console.log(
							`[time] Got ${this.info.heartBeat} for heart beat. Sending authentication...`
						);
						this.send(2, {
							token: token,
							intents: this.intents,
							properties: {
								$os: "linux",
							},
						});
						console.log(
							`[date] Info sent and done. Starting heart beat`
						);
						this.heartBeat();
					}
					break;
				case 11:
					{
						if (this.debug) console.log("recived heart beat");
					}
					break;
				case 0: {
					// events
					switch (String(this.payload.event).toLowerCase()) {
						case "ready":
							{
								this.eventReady(this.payload);
							}
							break;
						case "message_create": {
							this.eventMessageCreate(this.payload);
						}
					}
				}
			}
		};
	}
	/** login/start
	 * @param {'token'} t
	 */
	login(t) {
		token = t;
	}

    // guild (data) {
    //     let ID = data['id'];
    //     let api = {
    //         channels: {
    //             message (content) {
    //                 post()
    //             }
    //         }
    //     }
    // }
    channel (ID) {
        const api = {
            message (content) {
                post(`/channels/${ID}/messages`, content)
            }
        }
    }



	// event emits. only for this class use
	/** send */
	eventReady(data) {
		// on bot ready
		this.emit("ready", data);
	}
	eventMessageCreate(data) {
		// on message
		this.emit("message", data);
	}

	heartBeat() {
		setInterval(() => {
			if (this.debug) console.log("Sent Heart beat");
			this.send(1, this.info.seq);
		}, this.info.heartBeat);
	}

	send(op, data) {
		this.server.send(
			JSON.stringify({
				op: op,
				d: data,
			}),
			(err) => {
				if (err) {
					console.log(`Server Send Error: ${err}`);
					process.exit();
				}
			}
		);
	}
}

module.exports = Bot;


function get (path, data = null) {
    axios({
        baseURL: 'https://discord.com/api/oauth2/authorize',
        url: path,
        method: 'get',
        headers: {
            'Content-Type': 'application/json',
            Authorization: `Bot ${token}`
        },
    }).then((res) => {
        if (data) {
            return res.data[data];
        } else {
            return res.data
        }
    }).catch((err) => {
        console.log(`Axios Get Error: ${ err }`);
    })
}
function post (path, data) {
    axios({
        baseURL: 'https://discord.com/api/oauth2/authorize',
        url: path,
        method: 'get',
        headers: {
            'Content-Type': 'application/json',
            Authorization: `Bot ${token}`
        },
        data: data
    }).catch((err) => {
        console.log(`Axios Get Error: ${ err }`);
    })
}

const dog = new Bot();

dog.guild('fefe').get('name');