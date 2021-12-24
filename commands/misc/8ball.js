
module.exports = {
    name: '8ball',
    description: 'Shake the ball and ask.',
    help: '',
    execute(client, message, args) {
        const thisChannel = client.channels.cache.get(message.channel.id);
        const eightball = require('8ball')();
        thisChannel.send(":8ball: " + message.author.username + ": " + eightball);
    },
};