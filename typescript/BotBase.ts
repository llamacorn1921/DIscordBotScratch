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
				case 10: {
					// connection
					this.info.heartBeat = _data.d.heartbeat_interval;
				}
			}
		};
	}


    /** start the bots 'heart' */
    heartbeat () {
        setInterval(() => {
            this.debug = ('Connection', 'Sending heartbeat', null, false);
        }))
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
        exit: boolean = false;
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
