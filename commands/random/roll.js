module.exports = {
    name: 'roll',
    description: 'Roll for it!',
    help: '',
    execute(client, message, args) {
        var dice = parseInt(args.shift());
        if (!dice || !dice > 0) {
            dice = 6;
        }
        var roll = Math.floor(Math.random() * dice) + 1;
        if (roll) {
            message.reply(`You rolled a ${roll} out of ${dice}!`);
        }
    },
};