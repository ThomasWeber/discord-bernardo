

module.exports = {
    name: 'tableflip',
    description: '',
    help: '',
    execute(client, message, args) {
        const thisChannel = client.channels.cache.get(message.channel.id);
        thisChannel.send(`https://tenor.com/view/tableflip-gif-4837963`);
    }
};



