const BotBase = require('./BotBase');


/** the actual bot */
class Bot extends BotBase {
	constructor(intents, debug = false) {
		super();
		this.intents = intents;
		this.bug = debug;
	
	}
}


module.exports = Bot;
