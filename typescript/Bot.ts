/** the base class of the bot */
class BotBase extends EventEmitter {
	/** BASE: intents for the bot */
	intents: number;
	/** BASE: the server that the bot connects to */
	server: WebSocket;
	/** BASE: value to decide if debug info should show */
	bug: boolean;
	/** BASE: bot info */
	info: { session_id: number; heartBeat: number; sequnce: number };
	/** BASE: the payload for each event/message */
	payload: { op: number; event: string; data: object };
	/** BASE: the bots token */
	token: string;

	constructor() {
		super();

		this.server = new WebSocket(
			"wss://gateway.discord.gg/?v=9&encoding=json"
		);

		this.server.onerror = (event) => {
			// log
		};
		this.server.onmessage = (event) => {
			let _data = JSON.parse(event.data);

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
						// connection
						this.info.heartBeat = _data.d.heartbeat_interval;
						this.log(
							"Connection",
							"Connected to server, sending auth..."
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
					switch (String(_data.t).toLowerCase()()) {
						case "ready":
							{
								this.log(
									"connection",
									"auth sent and accpeted, starting heartbeat, and bot is online"
								);
								this.heartbeat();
								this.eventReady(this.payload.data);
							}
							break;
						case "message_create": {
							this.eventMessage(this.payload.data);
						}
						default:
							break;
					}
				}
			}
		};
	}
	eventReady(data) {
		this.emit("ready", data);
	}
	eventMessage(data) {
		this.emit("message", data);
	}
	/** start the bots 'heart' */
	heartbeat() {
		setInterval(() => {
			this.debug = ("Connection", "Sending heartbeat");
			this.send(1, this.info.sequnce);
		}, this.info.heartBeat);
	}
	/** send data to server
	 * @param {number} code - the OP code to use
	 * @param {object} data - the data to send
	 */
	send(code, data) {
		this.server.send(
			JSON.stringify({
				op: code,
				d: data,
			})
		),
			(err) => {
				if (err) {
					this.debug = ("Data Send", err.message);
				}
			};
	}

	/** log data to console
	 * @param {string} label - log label
	 * @param {string} content - content to log
	 * @param {boolean} time - display timestamp with log
	 */
	log = function (label: string, content: string, time = false) {
		console.log(`[${timestamp(time)}] ${label} > ${content}`);
	};
	/** log debug information
	 * @param {string} label -log label
	 * @param {string} content - content to log
	 * @param {number} line - line number, if given
	 * @param {bool} exit - exit on log?
	 */
	debug = function (
		label: string,
		content: string,
		line: number = null,
		exit: boolean = false
	) {
		if (this.bug) this.log(`${line} | ${label}`, content, true);
		if (exit) process.exit();
	};
}

function timestamp(bool: boolean) {
	const date = new Date();
	if (bool) {
		return date.toLocaleDateString("en-US", {
			day: "2-digit",
			month: "2-digit",
			year: "2-digit",
			hour: "2-digit",
			minute: "2-digit",
			second: "2-digit",
		});
	} else {
		return "=== ===";
	}
}


class Bot extends BotBase {
    constructor (intents, debug = false) {
        super();
        this.intents = intents;
        this.bug = debug;
    }

    /** log bot in */
    login (t: 'token') {
        this.token = t
    }
}