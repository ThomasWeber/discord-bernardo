module.exports = {
    name: 'fox',
    description: 'Random fox image',
    help: '',
    execute(client, message, args) {
        const animals = require('random-animals-api');
        const thisChannel = client.channels.cache.get(message.channel.id);
        animals.fox()
            .then(url => thisChannel.send(url))
            .catch((error) => console.error(error));
    },
};