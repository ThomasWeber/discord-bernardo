const glob = require('glob');
const Discord = require("discord.js");
const config = require("./config.json");
const package = require("./package.json");
const client = new Discord.Client();
const db = require("./database.js");
client.prefix = config.prefix;

const globOptions = {
    nodir: false,
}

// load the commands
client.commands = new Discord.Collection();
const commandFiles = glob.sync("./commands/**/*.js", globOptions);
for (const file of commandFiles) {
    const command = require(`${file}`);
    client.commands.set(command.name, command);
}


client.on('ready', () => {
    console.log(`Logged in as ${client.user.tag}!`);

    // const homeChannel = client.channels.cache.get(homeChannelID);
    // homeChannel.send("I'm alive!");


    // var CronJob = require('cron').CronJob;
    // var job = new CronJob('* * * * * *', function() {
    //   console.log('You will see this message every second');
    // }, null, true, 'America/Los_Angeles');
    // job.start();




    client.user.setPresence({
        status: "online",  // online, idle, invisible, dnd
        activity: {
            name: "you since " + package.version,  // The message shown
            type: "WATCHING" // PLAYING/STREAMING/LISTENING/WATCHING/COMPETING/CUSTOM_STATUS -- but bots for now cannot CUSTOM_STATUS
        }
    })
        //.then(console.log)
        .catch(console.error);

});

client.on("message", function (message) {

    // ignore bots
    if (message.author.bot) {
        return;
    }

    // ignore anything that doesn't start with the prefix
    if (!message.content.startsWith(config.prefix)) {
        return;
    }

    // command structure
    const commandBody = message.content.slice(config.prefix.length);
    const args = commandBody.split(' ');
    const command = args.shift().toLowerCase();

    // ignore anything that isn't a recognized command
    if (!client.commands.has(command)) return;

    // make sure we have a user record for this user
    db.from('user').where({
        user_id: message.member.id,
    }).select().then(
        (userRows) => {

            // if this user didn't already exist
            if (!userRows.length) {

                // add it to the alias table
                db('user').insert({
                    user_id: message.member.id,
                    lock: true,
                    server: message.member.guild.id,
                    updated: Date.now(),
                }).then().catch((err) => { console.log(err); throw err });

            }

            // add any aliases as needed
            addAlias(client, message, message.member.user.username, "username");
            addAlias(client, message, message.member.displayName, "display");
            addAlias(client, message, message.member.user.tag, "tag");


            // try to run the command
            try {
                client.commands.get(command).execute(client, message, args);
            } catch (error) {
                console.error(error);
                message.reply('there was an error trying to execute that command!');
            }


        }).catch((err) => { console.log(err); throw err })


});


client.login(config.BOT_TOKEN);



function addAlias(client, message, aliasName, type) {

    aliasName = aliasName.toLowerCase();

    db.from('alias').where({
        name: aliasName,
    }).select().then(
        (aliasRows) => {

            // if this alias didn't already exist
            if (!aliasRows.length) {

                // add it to the alias table
                db('alias').insert({
                    user_id: message.member.id,
                    name: aliasName,
                    type: type,
                    updated: Date.now(),
                }).then().catch((err) => { console.log(err); throw err });

            }


            // TODO: Update if it does exists, to pre-empt rare cases of collisions

        }).catch((err) => { console.log(err); throw err })



}