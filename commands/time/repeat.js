const config = require("../../config.json");
const Discord = require("discord.js");
const db = require("../../database.js");

module.exports = {
    name: 'repeat',
    description: '',
    help: '',
    execute(client, message, args) {

        console.log('setting the repeater');


        var CronJob = require('cron').CronJob;
        var job = new CronJob('* * * * *', function () {
            message.reply("a minute has passed!")
        }, null, true, 'America/Los_Angeles');
        job.start();

        



    },
};