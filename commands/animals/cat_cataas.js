module.exports = {
    name: 'cat',
    description: 'Random cat image',
    help: '',
    execute(client, message, args) {
        const thisChannel = client.channels.cache.get(message.channel.id);
        
        const Cataas = require('cataas-api')
        var cataas = new Cataas()
        var gif = {
            Gif: true,
            Size: 'md',
            // Text: "hey dude",
            // Filter: "paint",
            TextSize: 35,
            TextColor: "LightBlue",
        }
        var resized = {
            Width: 300,
            Height: 200,
        }
        cataas.options = gif
        cataas.options = resized


        cataas.encode()
        cataas.get()
            .then(readable => {
                const stream = new fs.createWriteStream('cat.png')
                // readable.pipe(stream)
            })
            .catch(e => console.error(e))


    },
};