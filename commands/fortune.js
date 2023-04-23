const Discord = require("discord.js");
const fs = require('fs');

module.exports = {
    name: 'fortune',
    description: 'Get your fortune',
    help: '',
    execute(client, message, args) {

        const thisChannel = client.channels.cache.get(message.channel.id);


        try {


            
            const data = fs.readFileSync('assets/fortunes.txt', 'utf8');
            const fortunes = data.split('\n');
            const randomIndex = Math.floor(Math.random() * fortunes.length);
   

            thisChannel.send(fortunes[randomIndex])
             


        }
        catch (error) {
            message.reply("Sorry, your future is too murky");
        }



    },
};