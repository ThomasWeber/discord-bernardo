const Discord = require("discord.js");
const weather = require('weather-js');
const config = require("../config.json");
const db = require("../database.js");

const degF = "F";
const degC = "C";
const divider = "/"


module.exports = {
    name: 'msnweather',
    description: 'Get the weather for a location',
    help: '',
    execute(client, message, args) {
        processCommand(client, message, args)
    },
};



async function processCommand(client, message, args) {

    // Get the alias table joined with the user table
    const response = db
        .from('alias')
        .join('user', 'alias.user_id', '=', 'user.user_id')
        .select()
        .then((aliases) => {

            const thisUser = aliases.find(row => row.user_id === message.author.id);
            args = args.join(' ').substring(0, 128).toLowerCase();

            // if the user gave an argument
            if (args) {

                // if the argument is a recognized user alias
                const thisAlias = aliases.find(row => row.name === args);
                if (thisAlias) {
                    doWeather(message, thisAlias.location);
                }

                // if the argument is a lock or unlock command
                else if (args == 'lock') {
                    if (thisUser.location) {
                        updateLock(thisUser.user_id, true);
                        message.reply('Your location is now locked to ' + thisUser.location)
                    }
                    else {
                        message.reply("Sorry, I don't know your location.");
                    }
                }
                else if (args == 'unlock') {
                    updateLock(thisUser.user_id, false);
                    message.reply('Location unlocked!')
                }


                // otherwise, assume the argument is a location
                else {
                    doWeather(message, args);

                    // if the location is not locked, save this location
                    if (!thisUser.location || !thisUser.lock) {
                        updateLocation(thisUser.user_id, args);
                    }
                }


            }
            // No argument given
            else {

                // use the user's saved location
                if (thisUser.location) {
                    doWeather(message, thisUser.location);
                }
                else {
                    message.reply("Sorry, I don't know your location.");
                }
            }


        })
}



// Add or Update the user's location lock setting, second argument controls the lock status
function updateLock(targetUser, lock) {
    
    db.from('user').where({
        user_id: targetUser,
    }).select().then(
        (rows) => {

            if (rows.length) {

                // updating existing user location
                db('user')
                    .where({ user: targetUser, })
                    .update({
                        user: targetUser,
                        lock: lock,
                        updated: Date.now(),
                    }).then();

            } 
        }).catch((err) => { console.log(err); throw err })
}




// Add or Update the user's location in the database
function updateLocation(targetUser, location) {
    
    db.from('user').where({
        user_id: targetUser,
    }).select().then(
        (rows) => {

            if (rows.length) {

                // updating existing user location
                db('user')
                    .where({ user_id: targetUser, })
                    .update({
                        user_id: targetUser,
                        location: location,
                        updated: Date.now(),
                    }).then();


            } 

            // no longer needed because user records are created when a command is sent
            // else {

            //     // adding new user location
            //     db('user').insert({
            //         user_id: targetUser,
            //         location: location,
            //         updated: Date.now(),
            //         lock: true,
            //     }).then();

            // }
        }).catch((err) => { console.log(err); throw err })
}


function celsius(f) {
    return Math.round((f - 32) * (5 / 9));
}


async function doWeather(message, location) {
    weather.find({ search: location, degreeType: 'F' }, function (err, result) {
        if (err) {
            console.log(err);
        }
        else {

            console.log(result);

            if (result[0]) {                

                //console.log(JSON.stringify(result, null, 2));       // output json to console, for debugging/devel
                var wrDate = new Date(result[0].current.date + "T" + result[0].current.observationtime);
                var windDisplay = result[0].current.winddisplay.replace(/north/i,"N");
                windDisplay = windDisplay.replace(/south/i,"S");
                windDisplay = windDisplay.replace(/east/i,"E");
                windDisplay = windDisplay.replace(/west/i,"W");
                
                var output = new Discord.MessageEmbed()
                    .setColor('#0099ff')
                    .setTitle('Weather for ' + result[0].location.name)
                    //.setURL('https://discord.js.org/')
                    .setDescription('*' + result[0].current.skytext + '*')
                    .setFooter(wrDate.toDateString() + '   ' + wrDate.toTimeString().substring(0,5))
                    .setThumbnail(result[0].current.imageUrl)
                    .addFields(
                        { name: 'Current', value: result[0].current.temperature + degF + divider + celsius(result[0].current.temperature) + degC, inline: true },
                        { name: 'Low', value: result[0].forecast[1].low + degF + divider + celsius(result[0].forecast[1].low) + degC, inline: true },
                        { name: 'High', value: result[0].forecast[1].high + degF + divider + celsius(result[0].forecast[1].high) + degC, inline: true },
                        { name: 'Humidity', value: result[0].current.humidity + '%', inline: true },
                        { name: 'Wind', value: windDisplay, inline: true },
                        //{ name: '\u200B', value: '\u200B' },
                    )
                
                // only show wind chill if freezing or below
                //if (result[0].current.feelslike < 33) {
                    output.addField('Feels Like', result[0].current.feelslike + degF + divider + celsius(result[0].current.feelslike) + degC, true);
                //}

                // add alerts to the description
                if (result[0].current.alert) {
                    output.setDescription('*' + result[0].current.skytext + '* **ALERT: ' + result[0].current.alert + '**');
                }

                // replace the ugly icons with prettier ones
                const icon = result[0].current.imageUrl.match(/\/(\d+)\.gif$/)[1];
                //console.log('icon = ' + icon)
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
iconName[9] = 'showers';
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
iconName[29] = 'partly-sunny';
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

