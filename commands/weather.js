const Discord = require("discord.js");
const weather = require('weather-js');
const config = require("../config.json");
const db = require("../database.js");

const degF = "F";
const degC = "C";
const divider = "/"


module.exports = {
    name: 'weather1',
    description: 'Get the weather for a location',
    help: '',
    execute(client, message, args) {

        var location = args.join(' ').substring(0, 40);

        if(!location) {
            message.reply("Please input a location.");
        }


        try {
            
            doWeather(message, args, location);
        }
        catch (error) {
            message.reply("Sorry, I had trouble retrieving the weather information.");
        }
    },
};


function celsius(f) {
    // return Math.round((f - 32) * (5 / 9));
    return ((f-32) * (5/9)).toFixed(1);
}







function doWeather(message, args, location) {
    weather.find({ search: location, degreeType: 'F' }, function (err, result) {
        if (err) {
            console.log(err);
        }
        else {

            if (result[0]) {

                //console.log(JSON.stringify(result, null, 2));       // output json to console, for debugging/devel

                const output = new Discord.MessageEmbed()
                    .setColor('#0099ff')
                    .setTitle('Weather for ' + result[0].location.name)
                    //.setURL('https://discord.js.org/')
                    .setDescription('*' + result[0].current.skytext + '*')
                    .setThumbnail(result[0].current.imageUrl)
                    .addFields(
                        { name: 'Current', value: result[0].current.temperature + degF + divider + celsius(result[0].current.temperature) + degC, inline: true },
                        { name: 'Low', value: result[0].forecast[1].low + degF + divider + celsius(result[0].forecast[1].low) + degC, inline: true },
                        { name: 'High', value: result[0].forecast[1].high + degF + divider + celsius(result[0].forecast[1].high) + degC, inline: true },
                        { name: 'Humidity', value: result[0].current.humidity + '%', inline: true },
                        { name: 'Wind', value: result[0].current.winddisplay, inline: true },
                        //{ name: '\u200B', value: '\u200B' },
                    )

                // add alerts to the description
                if (result[0].current.alert) {
                    output.setDescription('*' + result[0].current.skytext + '* **ALERT: ' + result[0].current.alert + '**');
                }

                // replace the ugly icons with prettier ones
                const icon = result[0].current.imageUrl.match(/\/(\d+)\.gif$/)[1];
                console.log('icon = ' + icon)
                const iconURL = config.weatherIconsURL + iconName[icon] + ".png";
                //console.log("iconURL = " + iconURL);
                output.setThumbnail(iconURL);


                message.reply(output);
            }
            else {
                message.reply("Sorry, I could not find " + location + ".");
            }
        }
    });
}


const iconName = [];
iconName[1] = 'thunderstorms';
iconName[2] = 'thunderstorms';
iconName[3] = 'thunderstorms';
iconName[4] = 'thunderstorms';
iconName[5] = 'rain-and-snow';
iconName[6] = 'rain-and-snow';
iconName[7] = 'sleet';
iconName[8] = 'ice';
iconName[9] = 'freezing-rain';
iconName[10] = 'sleet';
iconName[11] = 'rain';
iconName[12] = 'rain';
iconName[13] = 'flurries';
iconName[14] = 'snow';
iconName[15] = 'snow';
iconName[16] = 'snow';
iconName[17] = 'thunderstorms';
iconName[18] = 'showers';
iconName[19] = 'fog';
iconName[20] = 'fog';
iconName[21] = 'overcast';
iconName[22] = 'fog';
iconName[23] = 'fog';
iconName[24] = 'wind';
iconName[25] = 'cold';
iconName[26] = 'cloudy';
iconName[27] = 'night/partly-cloudy';
iconName[28] = 'mostly-cloudy';
iconName[29] = 'night/partly-cloudy';
iconName[30] = 'partly-sunny';
iconName[31] = 'night/clear';
iconName[32] = 'sunny';
iconName[33] = 'night/partly-cloudy';
iconName[34] = 'partly-sunny'; //'mostly-cloudy';
iconName[35] = 'thunderstorms';
iconName[36] = 'hot';
iconName[37] = 'mostly-cloudy-w-thunderstorms';
iconName[38] = 'mostly-cloudy-w-thunderstorms';
iconName[39] = 'mostly-cloudy-w-showers';
iconName[40] = 'showers';
iconName[41] = 'mostly-cloudy-w-snow';
iconName[42] = 'snow';
iconName[43] = 'snow';
iconName[44] = '';
iconName[45] = 'night/partly-cloudy-w-showers';
iconName[46] = 'night/mostly-cloudy-w-snow';
iconName[47] = 'night/partly-cloudy-w-thunderstorms';





