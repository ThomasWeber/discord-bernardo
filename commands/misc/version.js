const package = require("../../package.json");

module.exports = {
    name: 'version',
    description: '',
    help: '',
    execute(client, message, args) {
        message.reply(package.name + `, version ` + package.version );
    },
};