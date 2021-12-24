module.exports = {
    name: 'heads',
    description: 'You call heads',
    execute(client, message, args) {
        var flip = Math.floor(Math.random() * 2);
        if (flip) {
            message.reply(`Congrats, you got heads!`);
        }
        else {
            message.reply(`Sorry, you got tails!`);
        }
    },
};