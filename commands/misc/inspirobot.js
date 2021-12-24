

module.exports = {
    name: 'inspirobot',
    description: '',
    help: '',
    execute(client, message, args) {
        const thisChannel = client.channels.cache.get(message.channel.id);

        var request = require('request');   // simple http request, technically deprecated but good enough for this

        request("http://inspirobot.me/api?generate=true", (error, response, body) => {
            if (error) {
                console.log(error)
            } else {
                thisChannel.send(body);
            }
        })


    },
};