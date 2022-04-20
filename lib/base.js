

class BotBase extends EventEmitter {
    /** dog */
    intents;
    token;
    server;
    intents;
    constructor () {
        |
        super();
        
        this.server = new WebSocket("wss://gateway.discord.gg/?v=9&encoding=json")
    }

    token (token) {
        this.token = token;
    }
    eventReady (data) {
        this.emit('ready', data);
    }
    eventMessage (data) {
        this.emit('message', data);
    }
}

class Bot extends BotBase {

    constructor(intents) {
        super();
        this.intents = intents;
    }
}

const dog = new Bot();


