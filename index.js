const discord = require('discord.js')
const client = new discord.Client()
const ytdl = require('ytdl-core')
const dispatcher = null
const dispatcher_msg = null
const config = require('./config.json')

client.login(config.token)

client.on('message', async (message) => {
    if (!message.content.startsWith('.')) return;
    if (message.author.bot) return;
    if (!message.guild) return;

    if (message.content === ".radio") {
        
            // Only try to join the sender's voice channel if they are in one themselves
            if (message.member.voice.channel) {
              const connection = await message.member.voice.channel.join();
              let live = ytdl('https://www.youtube.com/watch?v=9FjAo1SjoQs')
              dispatcher = connection.play(live);
              dispatcher.setVolume(1);
              dispatcher_msg = message
              dispatcher.on('finish', () => {
                dispatcher_msg.channel.send('Transmition terminée')
              });
              
            } else {
              message.reply('Tu as besoin de rejoindre un salon vocal!!!!!!!!!');
            }
         
     
    } else if (message.content.startsWith('.vol')) {
        let args = message.content.split(' ')
        dispatcher.setVolume(args[1])
    }
})

client.on('ready', () => {
    console.log('YOUPI')
})