module.exports = {
    name: 'tails',
    description: 'You call tails',
    execute(client, message, args) {
        var flip = Math.floor(Math.random() * 2);
        if (flip) {
            message.reply(`Congrats, you got tails!`);
        }
        else {
            message.reply(`Sorry, you got heads!`);
        }
    },
};