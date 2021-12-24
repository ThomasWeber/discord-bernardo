module.exports = {
    name: 'countdown',
    description: '3 2 1 Go!',
    help: '',
    execute(client, message, args) {
        const waitTime = 1000; //time in ms between counts
        const thisChannel = client.channels.cache.get(message.channel.id);

        var start = parseInt(args.shift());
        if (!start || start > 4) {
            start = 4;
        }

        function sayMsg() {
            if (start == 0) {
                clearInterval(waiter);
                thisChannel.send("Go!");
            } else {
                thisChannel.send(start);
                start--;
            }
        }

        waiter = setInterval(sayMsg, waitTime);
    },
};