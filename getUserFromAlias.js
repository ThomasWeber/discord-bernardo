const Discord = require("discord.js");
const db = require("./database.js");

const nick = "jah";

var user_id = await getID(nick);

console.log( user_id )



function getID() {
    let response = db
        .from('alias')
        .join('user', 'alias.user', '=', 'user.user')
        .where({
            'alias.alias': nick

        })
        .select()
        .then((rows) => {

            user_id = rows[0].user;
            var output = nick + ' is user ' + user_id + ' from ' + rows[0].location;
            //console.log(output);

            return user_id;


        }).catch((err) => { console.log(err); throw err });

}