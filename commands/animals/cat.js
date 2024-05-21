module.exports = {
    name: 'cat',
    description: 'Random cat image',
    help: '',
    execute(client, message, args) {
        const thisChannel = client.channels.cache.get(message.channel.id);  

        var request = require('request'); 

        request("https://api.thecatapi.com/v1/images/search", (error, response, body) => {
            if (error) {
                console.log(error)
            } else {

                const bodyJSON = JSON.parse(body)

                thisChannel.send(bodyJSON[0].url)


            }
        })        

    },
};