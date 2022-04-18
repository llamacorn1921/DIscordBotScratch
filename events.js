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
    /** @type {{intents: number, presence: object}} */
    config;
    server;
    emitter;
    /** @type {{heartbeat: number, seq: number, session_id: number}} */
    info;
    /** @type {{op: number, event: string, data: object}} */
    payload = {};
    /** @type {{heartbeat: boolean}} */
    bools;
    constructor (token, config) {
        this.token = token;
        this.config = config;

        this.emitter = new Event();
        this.server = new WebSocket("wss://gateway.discord.gg/?v=9&encoding=json");

        this.server.onmessage = (event) => {
            /** @type {{op: number, event: string, data: object}} */
            payload = JSON.parse(e.data); // breake response into chunks then get the data section

            this.emitter.emit(payload.event.toLowerCase(), payload);
        };

    };
    on (evet, func) {
        emitter.on(event, (data) => {
            func(data);
        })
    }



    startHeart () {
        setInterval(() => {
            this.server.send();
        }, this.info.heartbeat);
    }
}

const dog = new Bot();
dog.on('do', (data) => {
    console.log('e');
})