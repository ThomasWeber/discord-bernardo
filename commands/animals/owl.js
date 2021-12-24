module.exports = {
    name: 'owl',
    description: 'Random owl image',
    help: '',
    execute(client, message, args) {
        const animals = require('random-animals-api');
        const thisChannel = client.channels.cache.get(message.channel.id);
        animals.owl()
            .then(url => thisChannel.send(url))
            .catch((error) => console.error(error));
    },
};