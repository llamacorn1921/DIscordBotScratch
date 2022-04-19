
server.onerror = (e) => {
	console.log(`Error: ${e.message}`);
};

server.onopen = (e) => {
	console.log(`Bot has connected to server`);
};
server.onmessage = (e) => {
	// every message received from server
	payload - JSON.parse(e.data); // breake response into chunks and get the data sections
	op = payload.op; // op code
	trigger = payload.t; // payload even name
	botInfo.seq = payload.sp; // sequence number. used for heartbeats
	data = payload.d; // payload data

	switch (
		op // decides what to do for what
	) {
		case 10: // first connection to server
			{
				botInfo.heartbeat = data.heartbeat_interval; // gets how many secnds between each heartbeat
				console.log(`Recevied heartbeat: ${botInfo.heartbeat}`);
				send({
					// send authentication to server
					op: 2, // op: identify
					d: {
						token: config.discord.bot.token,
						intents: 513, // intents
						properties: {
							$os: "linux",
							$browser: "chrome",
							$device: "chrome",
						},
						presence: {
							afk: false,
						},
					},
				});
			}
			break;
		case 0: {
			switch (trigger) {
				case "READY": // when server has connected and confirmed authentication
					{
						console.log(
							`Bot is now online.\nSession ID: ${data.session_id}`
						);
					}
					break;
				case "GUILD_CREATE": {
					console.log(
						`Guild detected\nName: ${data.name}\tID: ${data.id}\nDescription: ${data.description}\nMember count: ${data.member_count}\tOwner ID: ${data.owner_id}\nBot join time: ${data.joined_at}`
					);
				}
				case "MESSAGE_CREATE": {
					console.log(`=== === === === ===\nNew message`);
				}
			}
		}
	}
};

/**
 * send data to server
 * @param {number} op
 * @param {object} data - data to send
 */
function send(_op, _data) {
	server.send(
		JSON.stringify({
			op: op,
			d: _data,
		})
	);
}
function heartBeat() {
	// send heartbeat
	setInterval(() => {
		// repeat every x seconds
		send(1, botInfo.seq);
	}, botInfo.heartbeat);
}


server.onmessage = (e) => {
	// every message received from server
	payload - JSON.parse(e.data); // breake response into chunks and get the data sections
	op = payload.op; // op code
	trigger = payload.t; // payload even name
	botInfo.seq = payload.sp; // sequence number. used for heartbeats
	data = payload.d; // payload data

	switch (
	op // decides what to do for what
	) {
		case 10: // first connection to server
			{
				botInfo.heartbeat = data.heartbeat_interval; // gets how many secnds between each heartbeat
				console.log(`Recevied heartbeat: ${ botInfo.heartbeat }`);
				send({
					// send authentication to server
					op: 2, // op: identify
					d: {
						token: config.discord.bot.token,
						intents: 131071, // intents
						properties: {
							$os: "linux",
							$browser: "chrome",
							$device: "chrome",
						},
						presence: {
							afk: false,
						},
					},
				});
			}
			break;
		case 0: {
			switch (trigger) {
				case "READY": // when server has connected and confirmed authentication
					{
						console.log(
							`Bot is now online.\nSession ID: ${ data.session_id }`
						);
					}
					break;
				case "GUILD_CREATE": {
					console.log(
						`Guild detected\nName: ${ data.name }\tID: ${ data.id }\nDescription: ${ data.description }\nMember count: ${ data.member_count }\tOwner ID: ${ data.owner_id }\nBot join time: ${ data.joined_at }`
					);
				}
				case "APPLICATION_COMMAND_CREATE": {
					console.log('app command create');
				}
					break;
				case "MESSAGE_CREATE": {
					console.log(`=== === === === ===\nNew message`);
				}
			}
		}
	}
};