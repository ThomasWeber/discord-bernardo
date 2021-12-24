const Discord = require("discord.js");

module.exports = {
    name: 'imdb',
    description: 'Get info from imdb',
    help: '',
    execute(client, message, args) {

        const nameToImdb = require("name-to-imdb");
        const imdb = require("imdb");

        try {
            nameToImdb(args.join(' '), function (err, res, inf) {
                // console.log(res); // "tt0121955"
                // inf contains info on where we matched that name - e.g. metadata, or on imdb
                // and the meta object with all the available data
                //console.log(inf);

                if(inf.isCached == true){
                    return
                }

                try {
                    imdb(res, function (err, data) {

                        // console.log('inf.meta.name = ' + inf.meta.name);

                        if (err) {
                            message.reply("Sorry, I wasn't able to find anything.")
                            console.log(err.stack);
                            return;
                        }

                        console.log(inf);

                        // if (data)
                        //     console.log(data);

                        if (inf.meta.type == 'feature') {
                            inf.meta.type = 'Movie'
                        }
                        else if (inf.meta.type == 'TV series') {
                            inf.meta.type = 'Series'
                            data.year = inf.meta.yearRange;baby
                        }

                        const output = new Discord.MessageEmbed()
                            .setColor('#0099ff')
                            .setTitle(data.title)
                            .setURL('https://www.imdb.com/title/' + res)
                            .setAuthor(inf.meta.type)
                            .setDescription(data.description)    
                            .setThumbnail(data.poster)
                            .addFields(
                                { name: 'Year', value: data.year, inline: true },
                                { name: 'Rating', value: data.rating, inline: true },
                                { name: 'Genres', value: data.genre.join(', ') },
                                { name: 'Starring', value: inf.meta.starring },
                            )

                        message.reply(output);


                    });
                }
                catch (error) {
                    message.reply("Sorry, I couldn't find anything.");
                }


            })
        }
        catch (error) {
            message.reply("Sorry, I couldn't find anything.");
        }



    },
};