const Discord = require("discord.js");

module.exports = {
    name: 'anime',
    description: 'Get info about an anime.',
    help: '',
    execute(client, message, args) {

        const malScraper = require('mal-scraper')

        malScraper.getInfoFromName(args.join(' '))
            .then((data) => {

                //console.log(data);
                if (data.title) {

                    if (data.type === 'TV') {

                        const output = new Discord.MessageEmbed()
                            .setColor('#0099ff')
                            .setTitle(data.title)
                            .setURL(data.url)
                            .setAuthor(data.studios.join(', '))
                            .setDescription(data.synopsis.substring(0, data.synopsis.indexOf('\n')))    // stops at the first line break
                            .setThumbnail(data.picture)
                            .addFields(
                                { name: 'Score', value: data.score, inline: true },
                                { name: 'Premiered', value: data.premiered, inline: true },
                                { name: 'Episodes', value: data.episodes, inline: true },
                                { name: 'Genres', value: data.genres.join(', ') },
                            )

                        message.reply(output);


                    } else {
                        message.reply("Sorry! " + data.title + " is a " + data.type + " and so far Jah has only set me up for Shows! :(");
                    }
                }



            })
            .catch((err) => {
                console.log(err)
                message.reply("Sorry, I couldn't find anything.");
            })
    






},
};