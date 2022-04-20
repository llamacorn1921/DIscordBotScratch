const { WebSocket } = require("ws");
const EventEmitter = require("events");



/** the base of the bot */
class BotBase extends EventEmitter {
	/**BASE: The bots intents
	 * @type {number} */
	intents;
	/**BASE: the server to connect to */
	server;
	/**BASE: debug information if true */
	bug;
	/**BASE: bot info
	 * @type {{session_id: number, heartBeat: number, sequnce: number}}
	 */
	info = {};
	/** @type {{op: number, event: string, data: object}} */
	payload;
	/** @type {string} BASE: CON bot token */
	token;
	constructor() {
		super();
		this.server = new WebSocket(
			"wss://gateway.discord.gg/?v=9&encoding=json"
		);
		this.server.onerror = (event) => {
			this.log("Socket Error", event.message);
		};
		this.server.onmessage = (event) => {
			console.log(event);
			let _data = JSON.parse(event.data);
			this.debug = ("name", ",mike");
			if (_data.s !== null) {
				this.info.sequnce = _data.s;
			}

			this.payload = {
				op: _data.op,
				event: _data.t,
				data: _data.d,
			};

			switch (_data.op) {
				case 10:
					{
						this.info.heartBeat = _data.d.heartbeat_interval;
						this.log(
							"Connection",
							`Connected to server. Heartbeat is ${_data.d.heartbeat_interval}. Sending auth...`
						);
						this.send(
							2,
							JSON.stringify({
								token: this.token,
								intents: this.intents,
							})
						);
					}
					break;
				case 11:
					{
						this.debug("connection", "got heartbeat");
					}
					break;
				case 0: {
					switch (String(_data.t).toLowerCase()) {
						case "ready":
							{
								this.log(
									"Connection",
									"Auth sent and accpedted, starting heartbeat, and bot is now ready"
								);
								this.heartBeat();
								this.eventReady(this.payload.data);
							}
							break;
						case "message_create": {
							this.eventMessage(this.payload.data);
						}
					}
				}
			}
		};
		this.debug();
	}

	login(t) {
		this.token = t;
	}
	// events
	eventReady(data) {
		this.emit("ready", data);
	}
	eventMessage(data) {
		this.emit("message", data);
	}

	heartbeat() {
		setInterval(() => {
			this.debug("Connection", "Sending heartbeat");
			this.send(1, this.info.sequnce);
		}, this.info.heartBeat);
	}

	/** send info
	 * @param {number} code
	 * @param {object} data - data to send
	 */
	send(o, d) {
		this.server.send(
			JSON.stringify({
				op: o,
				d: d,
			})
		),
			(err) => {
				if (err) {
					console.log(err);
					process.exit();
				}
			};
	}

	/** log data to console
	 * @param {string} label - debug label
	 * @param {string} content - content to log
	 * @param {bool} timestamp - give timestamp?
	 */
	log(label, content, time = true) {
		console.log(`[${timestamp(time)}] ${label} > ${content}`);
	}

	/** debug data if 'debug' setting is true
	 * @param {string} label - debug label
	 * @param {string} content - content to log
	 * @param {number} line - line of debug
	 * @param {bool} exit - exit prorgam
	 */
	debug = function (label, content, line = null, exit = false) {
		if (this.fed) this.log(`${line} | ${label} > ${content}`, true);
		if (exit) process.exit();
	};
}

module.exports = BotBase;

/** give timestamp */
function timestamp(bool) {
	const date = new Date();
	if (bool) {
		return date.toLocaleDateString(
			("en-US", { hour: "2-digit", minute: "2-digit", second: "2-digit" })
		);
	} else {
		return "=== ===";
	}
}
