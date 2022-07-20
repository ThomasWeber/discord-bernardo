const Discord = require("discord.js");
const OpenWeatherAPI = require("openweather-api-node")
const config = require("../config.json");
const db = require("../database.js");

const apiKey = config.openweathermap_key;

const degF = "F";
const degC = "C";
const divider = "/"


module.exports = {
    name: 'weather',
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

        }).catch((err) => { console.log(err); throw err })
}


function celsius(f) {
    return Math.round((f - 32) * (5 / 9));
}

function capitalize(s) {
    return s[0].toUpperCase() + s.substring(1);
}


async function doWeather(message, location) {

    let weather = new OpenWeatherAPI({
        key: apiKey,
        units: "imperial"
    })

    const zipcode = /^\d{5}(?:[-\s]\d{4})?$/;

    var loc = location
    if (zipcode.exec(location)) {
        try {
            loc = await weather.getLocation({ zipCode: location })
        }
        catch (error) {
            console.log(error);
            message.reply('Could not find ' + location);
            loc = null;
        }

    }
    else {
        try {
            loc = await weather.getLocation({ locationName: location })
        }
        catch (error) {
            console.log(error);
            message.reply('Could not find ' + location);
            loc = null;
        }
    }

    if (loc) {



        weather.setLocationByCoordinates(loc.lat, loc.lon)



        weather.getEverything().then(result => {

            if (!result) {
                message.reply("Sorry, I could not get weather for " + location + ".");
            }
            else {

                console.log(result)
                console.log(loc)


                var wrDate = new Date(result.current.dt);
                //var windDisplay = result[0].hourly[0].winddisplay.replace(/north/i,"N");
                var windDisplay = Math.round(result.hourly[0].weather.wind.speed) + 'mph '
                if (result.hourly[0].weather.wind.gust) {
                    windDisplay += 'with ' + Math.round(result.hourly[0].weather.wind.gust) + "mph gusts "
                }
                // windDisplay += ' @' + result.hourly[0].weather.wind.deg + '°'


                var output = new Discord.MessageEmbed()
                    .setColor('#0099ff')
                    .setTitle('Weather for ' + loc.name + ", " + loc.state)
                    //.setURL('https://discord.js.org/')
                    .setDescription('*' + capitalize(result.hourly[0].weather.description) + '*')
                    .setFooter(wrDate.toDateString() + '   ' + wrDate.toTimeString().substring(0, 5))
                    .setThumbnail(result.hourly[0].weather.icon.url)
                    .addFields(
                        { name: 'Current', value: Math.round(result.hourly[0].weather.temp.cur) + degF + divider + celsius(result.hourly[0].weather.temp.cur) + degC, inline: true },
                        { name: 'Low', value: Math.round(result.daily[0].weather.temp.min) + degF + divider + celsius(result.daily[0].weather.temp.min) + degC, inline: true },
                        { name: 'High', value: Math.round(result.daily[0].weather.temp.max) + degF + divider + celsius(result.daily[0].weather.temp.max) + degC, inline: true },
                        { name: 'Feels Like', value: Math.round(result.hourly[0].weather.feels_like.cur) + degF + divider + celsius(result.hourly[0].weather.feels_like.cur) + degC, inline: true },
                        { name: 'Humidity', value: result.hourly[0].weather.humidity + '%', inline: true },
                        { name: 'Wind', value: windDisplay, inline: true },

                    )


                message.reply(output)

            }


        })

    }


}

