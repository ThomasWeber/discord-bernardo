
const Discord = require("discord.js");
const db = require("../../database.js");

module.exports = {
    name: 'whois',
    description: 'Returns actual user based on given alias',
    help: '',
    execute(client, message, args) {

        if (args.length) {
            var response = db
                .from('user')
                .join('alias', 'alias.user_id', '=', 'user.user_id')
                .where({
                    'alias.name': args.join(' '),

                })
                .select()
                .then((rows) => {

                    message.reply(' ' + args.join(' ') + ' is an alias for user ' + rows[0].user_id + ' from ' + rows[0].location + ".");


                }).catch((err) => { console.log(err); throw err })

        } else {
            message.reply("No argument given!");
        }


    },
};