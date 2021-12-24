// module.exports = {
//     name: 'test',
//     description: 'test',
//     execute(client, message, args) {
//         console.log(args);
//         if (args[0] === 'test1')
//             message.reply(`test1 success!`);
//         if (args[0] === 'test2')
// 			message.reply(`test2 success!`);
// 		else {
// 			message.reply(`fail`);
// 		}
//     },
// };


module.exports = {
    name: 'test',
    description: '',
    help: '',
    execute(client, message, args) {
        message.reply(`success!`);
    },
};