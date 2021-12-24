module.exports = {
    name: 'bunny',
    description: 'Random bunny image',
    help: '',
    execute(client, message, args) {
        const animals = require('random-animals-api');
        const thisChannel = client.channels.cache.get(message.channel.id);
        animals.bunny()
            .then(url => thisChannel.send(url))
            .catch((error) => console.error(error));
    },
};