module.exports = {
    name: 'dog',
    description: 'Random dog image',
    help: '',
    execute(client, message, args) {
        const animals = require('random-animals-api');
        const thisChannel = client.channels.cache.get(message.channel.id);
        animals.dog()
            .then(url => thisChannel.send(url))
            .catch((error) => console.error(error));
    },
};