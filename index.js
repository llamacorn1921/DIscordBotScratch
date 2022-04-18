// gateway: wss://gateway.discord.gg
// wss://gateway.discord.gg/?v=9&encoding=json
var urllib = require('urllib');

urllib.request('https://discord.com/api/v8/applications/855268197657608213/guilds', {
	type: 'get',
	headers: {
		'Authorization':'Bot ODU1MjY4MTk3NjU3NjA4MjEz.YMwAlA.HaEj0X7OkTRl40eYLlM9rj8yFUE',
	}
}).then(function (result) {
  // result: {data: buffer, res: response object}
  console.log('status: %s, body size: %d, headers: %j', result.res.statusCode, result.data.length, result.res.headers);
}).catch(function (err) {
  console.error(err);
});
