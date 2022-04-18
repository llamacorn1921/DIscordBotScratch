const events = [
    'READY',
    'RESUMED',
    'GUILD_CREATE',
    'USER_UPDATE',
    'MESSAGE_CREATE',
    'MESSAGE_DELETE'
]


class Bot {
    token;
    server;
    emitter;
    /** @type {{heartbeat: number, seq: number, session_id: number}} */
    info;
    /** @type {{op: number, event: string, data: object}} */
    payload = {};
    constructor (token) {
        this.emitter = new EventEmitter();
        this.server = new WebSocket("wss://gateway.discord.gg/?v=9&encoding=json");

        this.server.onmessage = (event) => {
            /** @type {{op: number, event: string, data: object}} */
            payload = JSON.parse(e.data); // breake response into chunks and get the data sections
            op = this.payload.op;
            trigger = this.payload.event;
            data = this.payload.data;
            if (op == 10) {

            }
        };
    }
}