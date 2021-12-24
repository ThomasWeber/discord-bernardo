const config = require("../../config.json");
const Discord = require("discord.js");
const db = require("../../database.js");

module.exports = {
    name: 'reminder',
    description: '',
    help: '',
    execute(client, message, args) {

        console.log('setting the timer');
        
        
        //var date = new Date(2020, 10, 20, 5, 35, 1);
        var date = new Date(Date.now() + 5000);

        var j = schedule.scheduleJob(date, function(){
            console.log('The timer worked!');
          });





    },
};