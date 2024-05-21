module.exports = {
    name: 'dog',
    description: 'Random dog image',
    help: '',
    execute(client, message, args) {
        const thisChannel = client.channels.cache.get(message.channel.id);

        var request = require('request'); 

        request("https://dog.ceo/api/breeds/image/random", (error, response, body) => {
            if (error) {
                console.log(error)
            } else {

                const bodyJSON = JSON.parse(body)

                console.log(bodyJSON)

                thisChannel.send(bodyJSON.message);
            }
        })

    },
};