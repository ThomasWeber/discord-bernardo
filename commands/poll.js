const Discord = require("discord.js");
const pollEmbed = require('discord.js-poll-embed');

module.exports = {
    name: 'poll',
    description: 'poll the crowd',
    help: '',
    execute(client, message, args) {
        
        const pollOptions = ['🇦', '🇧', '🇨', '🇩', '🇪', '🇫', '🇬', '🇭', '🇮', '🇯', '🇰', '🇱', '🇲', '🇳', '🇴', '🇵', '🇶', '🇷', '🇸', '🇹', '🇺', '🇻', '🇼', '🇽', '🇾', '🇿',];
        const arguments = message.content.trim().split(/ +/g);
        let question = [];

        for (let i = 1; i < arguments.length; i++) {
            if (arguments[i].startsWith('"')) {
                break;
            }
            else question.push(arguments[i]);
        }
        question = question.join(' ');

        const choices = [];
        const regex = /(["'])((?:\\\1|\1\1|(?!\1).)*)\1/g;
        let match;

        while (match = regex.exec(arguments.join(' '))) {
            choices.push(match[2]);
        }

        let content = [];
        for (let i = 0; i < choices.length; i++) {
            content.push(`${pollOptions[i]} ${choices[i]}`);
        }
        content = content.join('\n');

        var embed = new Discord.MessageEmbed()
            .setColor('#8CD7FF')
            //.setThumbnail("http://www.antarat.com/projects/bernardo/images/poll-topic.png")
            .setTitle(`**${question}**`)
            .setDescription(content);

        message.channel.send(``, embed)
            .then(async m => {
                for (let i = 0; i < choices.length; i++) {
                    await m.react(pollOptions[i]);
                }
            });
    },
};