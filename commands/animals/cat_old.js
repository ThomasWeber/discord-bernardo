module.exports = {
    name: 'cat',
    description: 'Random cat image',
    help: '',
    execute(client, message, args) {
        const animals = require('random-animals-api');
        const thisChannel = client.channels.cache.get(message.channel.id);
        animals.cat()
            .then(url => thisChannel.send(url))
            .catch((error) => console.error(error));
    },
};