const https = require('https');

const options = {
    hostname: 'discord.com',
    path: '/api/v9/applications/855268197657608213/commands',
    method: 'post',
    headers: {
        'authentication'
    }
}

let command = {
    name: 'ping',
    type: 1,
    description: 'Sends a ping',

};

/** create command
 * @param {{name: string, type: number, description: string}} command
 */
function createCommand (command = {})