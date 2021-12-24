module.exports = {
    name: 'lizard',
    description: 'Random lizard image',
    help: '',
    execute(client, message, args) {
        const animals = require('random-animals-api');
        const thisChannel = client.channels.cache.get(message.channel.id);
        animals.lizard()
            .then(url => thisChannel.send(url))
            .catch((error) => console.error(error));
    },
};