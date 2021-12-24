const Discord = require("discord.js");
const config = require("../../config.json");
const db = require("../../database.js");



module.exports = {
    name: 'alias',
    description: 'Get the weather for a location',
    help: '!alias existingName newAlias',
    execute(client, message, args) {

        args = args.map(arg => arg.toLowerCase());

        if(args.length == 2) {
            addAlias(message, args[0], args[1])
        } else {
            message.reply(`Invalid arguments.`)
        }


    },
};


// Add or Update the user's location in the database
function addAlias(message, existingName, newName) {

    // check for the existing alias
    db.from('alias').where({
        name: existingName,
    }).select().then(
        (rows) => {

            if (rows.length) {
                // adding new alias
                db('alias').insert({
                    name: newName,
                    user_id: rows[0].user_id,
                }).then().catch((err) => { 
                    console.log(err); 
                    throw err 
                });

                message.reply(`I've added ${newName} as an alias for ${existingName}. `)
                
            }
            else {
                message.reply(`Sorry, I don't know who ${existingName} is yet. :(`)

            }

        }).catch((err) => { console.log(err); throw err })
}