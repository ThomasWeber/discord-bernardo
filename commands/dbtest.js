const db = require("../database.js");

module.exports = {
    name: 'dbtest',
    description: '',
    help: '',
    execute(client, message, args) {

        console.log(message);

        db.from('user-locations').where({
            user: 'gibbs',
        }).select()
            .then((rows) => {
                gibbs = rows[0]
                //console.log('inside db = ' + gibbsloc)
                message.reply(gibbs.location);
            }).catch((err) => { console.log(err); throw err })
            .finally(() => {
                db.destroy();
            });


    },
};