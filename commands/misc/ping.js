module.exports = {
	name: 'ping',
	description: 'Returns latency',
	help: '',
	execute(client, message, args) {
		const timeTaken = Date.now() - message.createdTimestamp;
        message.reply(`Pong! This message had a latency of ${timeTaken}ms.`);
	},
};