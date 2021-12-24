
const config = require("../../config.json");
const Discord = require("discord.js");

module.exports = {
    name: 'flight',
    description: '',
    help: '',
    execute(client, message, args) {
        const flightdata = require('flight-data');



        var flightOptions = {};
        flightOptions['limit'] = 1
        // flightOptions['arr_iata'] = args[0]
        flightOptions['flight_iata'] = args;

        // if (args[1]) {
        //     flightOptions['flight_date'] = '2020-12-02';
        // }

        console.log(flightOptions)


        flightdata.flights(
            {
                API_TOKEN: config.aviationstack_key,
                options: flightOptions,
            })
            .then(response => {


                const data = response.data[0];

                console.log(data)


                const output = new Discord.MessageEmbed()
                    .setColor('#0099ff')
                    .setTitle(data.departure.airport + ' to ' + data.arrival.airport)
                    //.setURL(data.url)                    


                    if(data.aircraft) {
                        output.setAuthor(data.airline.name + ' - ' + data.aircraft)
                    }
                    else {
                        output.setAuthor(data.airline.name)
                    }


                    var body = `\n**Status:** *${data.flight_status}*\n`

                    body += `\n **Departure** <:airplane_departure:768161959610286121>\n
                    **Scheduled:** ${new Date(data.departure.scheduled).toLocaleString("en-US", {timeZone: data.departure.timezone})} \n`

                    if(data.departure.actual) {
                        body += `**Actual:** ${new Date(data.departure.actual).toLocaleString("en-US", {timeZone: data.departure.timezone})} \n`
                    }

                    if(data.departure.terminal) {
                        body += `**Terminal:** ${data.departure.terminal}\n`
                    }

                    if(data.departure.gate) {
                        body += `**Gate:** ${data.departure.gate}\n`
                    }

                    body += `\n **Arrival** <:airplane_arriving:768161959610286121>\n
                    **Scheduled:** ${new Date(data.arrival.scheduled).toLocaleString("en-US", {timeZone: data.arrival.timezone})} \n`

                    if(data.arrival.actual) {
                        body += `**Actual:** ${new Date(data.arrival.actual).toLocaleString("en-US", {timeZone: data.arrival.timezone})} \n`
                    }

                    if(data.arrival.terminal) {
                        body += `**Terminal:** ${data.arrival.terminal}\n`
                    }

                    if(data.arrival.gate) {
                        body +=     `**Gate:** ${data.arrival.gate}\n`
                    }

                    output.setDescription(body)


                message.reply(output);

            })
            .catch(error => {
                console.log(error);
                message.reply("Sorry, I couldn't find information on that flight.");
            });



    },
};