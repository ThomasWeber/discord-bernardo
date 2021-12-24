module.exports = {
    name: 'duck',
    description: 'Random duck image',
    help: '',
    execute(client, message, args) {
        const animals = require('random-animals-api');
        const thisChannel = client.channels.cache.get(message.channel.id);
        animals.duck()
            .then(url => thisChannel.send(url))
            .catch((error) => console.error(error));
    },
};
