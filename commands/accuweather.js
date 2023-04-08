const Discord = require("discord.js");
//const OpenWeatherAPI = require("openweather-api-node")
const config = require("../config.json");
const db = require("../database.js");
const fetch = require('node-fetch');  // npm install node-fetch@2.0

// const openweathermap_apiKey = config.openweathermap_key;
const accuweather_apiKey = config.accuweather_key;



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

function round10(num) {
    return Math.round(num*10) / 10
}

function celsius(f) {
    return Math.round((f - 32) * (5 / 9));
}

function capitalize(s) {
    return s[0].toUpperCase() + s.substring(1);
}


async function doWeather(message, location) {

    accuweather(location)
    .then(data => discordOutput(message, data))
    .catch(err => {
        console.log('oops! request error')
        console.log(err);
    })


}



const getLocationKey = async(city) =>{



    const url = 'https://dataservice.accuweather.com/locations/v1/cities/search';
    const query = `?apikey=${accuweather_apiKey}&q=${city}`

    
    const response = await fetch(url+query);

    if(response) {

        const data = await response.json();


        return data[0];
    }
    else {


        throw err;
        return false;
    }

}


const getWeather = async(id) =>{

    const url = 'https://dataservice.accuweather.com/currentconditions/v1/'
    const query = `${id}?apikey=${accuweather_apiKey}&details=true`
    const response = await fetch(url+query);

    if (response) {
        const data = await response.json();

        return data[0];
    }
    else {

        throw err;
        return false;
    }
}

const getForecast = async(id) =>{

    const url = 'https://dataservice.accuweather.com/forecasts/v1/daily/5day/'
    const query = `${id}?apikey=${accuweather_apiKey}&details=true`
    // console.log(url+query)
    const response = await fetch(url+query);
    const data = await response.json();

    return data;
}



let accuweather = async (city) =>{
    // console.log('querying ' + city)


    
    const cityName = await getLocationKey(city);




    const weatherObj = await getWeather(cityName.Key);


    const forecastObj = await getForecast(cityName.Key);


    if (forecastObj.Headline.Text ) {
        return{cityName, weatherObj, forecastObj};
    }
    else {
        throw err;
        return false;
    }



    
}


async function discordOutput(message, data) {

    //console.log(data.weatherObj.TemperatureSummary )

    let windDisplay = data.weatherObj.Wind.Speed.Imperial.Value + ' ' + data.weatherObj.Wind.Speed.Imperial.Unit + ' & ' + data.weatherObj.WindGust.Speed.Imperial.Value + ' ' + data.weatherObj.WindGust.Speed.Imperial.Unit + ' gusts'
    let iconURL = 'https://developer.accuweather.com/sites/default/files/' + ("0" + data.weatherObj.WeatherIcon).slice(-2) + "-s.png"


    var output = new Discord.MessageEmbed()
    .setColor('#0099ff')
    .setTitle('Weather for ' + data.cityName.LocalizedName)
    .setURL(data.weatherObj.Link)
    .setDescription('*' + capitalize(data.forecastObj.Headline.Text) + '*')
    //.setFooter(wrDate.toDateString() + '   ' + wrDate.toTimeString().substring(0, 5))
    .setThumbnail(iconURL)
    .addFields(
        { name: 'Current', value: data.weatherObj.Temperature.Imperial.Value + degF + divider + data.weatherObj.Temperature.Metric.Value + degC, inline: true },
        { name: 'Low', value: data.weatherObj.TemperatureSummary.Past12HourRange.Minimum.Imperial.Value + degF + divider + data.weatherObj.TemperatureSummary.Past12HourRange.Minimum.Metric.Value + degC, inline: true },
        { name: 'High', value: data.weatherObj.TemperatureSummary.Past12HourRange.Maximum.Imperial.Value + degF + divider + data.weatherObj.TemperatureSummary.Past12HourRange.Maximum.Metric.Value + degC, inline: true },
        { name: 'Feels Like', value: data.weatherObj.RealFeelTemperature.Imperial.Value + degF + divider + data.weatherObj.RealFeelTemperature.Metric.Value + degC, inline: true },
        { name: 'Humidity', value: data.weatherObj.RelativeHumidity + '%', inline: true },
        { name: 'Wind', value: windDisplay, inline: true },

    )



    message.reply(output)

    // console.log(data.forecastObj.DailyForecasts[0].DegreeDaySummary)
}



async function discordOutputNoAPI(message, data) {

    console.log(data)




    message.reply("API not available")

    // console.log(data.forecastObj.DailyForecasts[0].DegreeDaySummary)
}