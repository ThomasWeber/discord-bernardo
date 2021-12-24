
module.exports = {
    name: 'coin',
    description: 'Flip a coin',
    execute(client, message, args) {
        var flip = Math.floor(Math.random() * 2);
        if (flip) {
            message.reply(`The coin landed on heads!`);
        }
        else {
            message.reply(`The coin landed on tails!`);
        }
    },
};
