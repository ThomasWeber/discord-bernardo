
const Discord = require("discord.js");
const db = require("../../database.js");

module.exports = {
	name: 'aliases',
	description: 'Returns all aliases for a given name.',
	help: '',
	execute(client, message, args) {

		var knownName = args[0].toLowerCase();

		// check for the existing alias
		const response = db
			.from('alias')
			.where({
				'name': knownName,
			}).select().then(
				(knownRow) => {

					if(knownRow.length) {

					db.from('alias').where({
						user_id: knownRow[0].user_id,
					}).select().then(
						(aliasRows) => {

							var aliases = [];
							for(var i in aliasRows) {
								if(aliasRows[i].name != knownName) {
									aliases.push(aliasRows[i].name);
								}
							}

							message.reply("The known aliases for " + knownName + " are: " + aliases.join(', '))

						}).catch((err) => { console.log(err); throw err })

					}
					else {
						message.reply(knownName + "? Who is " + knownName + "?")

					}



				}).catch((err) => { 
					console.log(err); throw err 
				})

	},
};