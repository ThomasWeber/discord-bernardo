const Discord = require("discord.js");
const OpenWeatherAPI = require("openweather-api-node")
const config = require("../config.json");
const db = require("../database.js");

const apiKey = config.openweathermap_key;

const degF = "F";
const degC = "C";
const divider = "/"


module.exports = {
    name: 'forecast',
    description: 'Get the weather forecase a location',
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

function dayName(dateStr) {
    var date = new Date(dateStr);
    return date.toLocaleDateString('en-US', { weekday: 'long' });
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
            console.log(result.daily[0])
            console.log(loc)

            if (!result) {
                message.reply("Sorry, I could not find " + location + ".");
            }
            else {

                var wrDate = new Date(result.current.dt);
                //var windDisplay = result[0].hourly[0].winddisplay.replace(/north/i,"N");
                var windDisplay = result.hourly[0].weather.wind.speed + 'mph '
                if (result.hourly[0].weather.wind.gust) {
                    windDisplay += 'with ' + result.hourly[0].weather.wind.gust + "mph gusts "
                }
                // windDisplay += ' @' + result.hourly[0].weather.wind.deg + ''


                var forecastDays = []
                for(var i=1; i<6; i++) {
                    thisField = {}                    
                    thisField.name = dayName(result.daily[i].dt);
                    thisField.value = result.daily[i].weather.description
                    thisField.inline = true                    
                    forecastDays.push(thisField)

                    thisField = {}                                   
                    i==1 ? thisField.name = "Temp" : thisField.name = "⠀" 
                    thisField.value = Math.round(result.daily[i].weather.temp.min) + '-' + Math.round(result.daily[i].weather.temp.max) + 'F  /  '  + celsius(result.daily[i].weather.temp.min) + '-' + celsius(result.daily[i].weather.temp.max) + 'C    ';
                    thisField.inline = true
                    forecastDays.push(thisField)

                    thisField = {}                    
                    i==1 ? thisField.name = "Feels Like" : thisField.name = "⠀" 
                    thisField.value = Math.round(result.daily[i].weather.feels_like.night) + '-' + Math.round(result.daily[i].weather.feels_like.day) + 'F  /  '  + celsius(result.daily[i].weather.feels_like.night) + '-' + celsius(result.daily[i].weather.feels_like.day) + 'C    ';
                    thisField.inline = true
                    forecastDays.push(thisField)


                }


                var output = new Discord.MessageEmbed()
                    .setColor('#0099ff')
                    .setTitle('Forecast for ' + loc.name + ", " + loc.state)
                    .setDescription('⠀')
                    // .setFooter('')
                    // .setThumbnail(result.hourly[0].weather.icon.url)
                    .addFields(
                        forecastDays
                    )


                message.reply(output)

            }


        })

    }

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

