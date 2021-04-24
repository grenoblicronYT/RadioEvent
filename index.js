const discord = require('discord.js')
const client = new discord.Client()
const ytdl = require('ytdl-core')
let dispatcher = require('./errdisp')
let dispatcher_msg = "" 
let config = require('./config.json')
let volume = 1

client.login(config.token)

client.on('message', async (message) => {
    if (!message.content.startsWith('.')) return;
    if (message.author.bot) {
      message.channel.send('Je ne suis pas contre les robots mais les DDOS.')
      return
    }
    if (!message.guild) {
      message.reply('Merci de rejoindre le serveur.')
      return
    }

    if (message.content === ".radio") {
        
            // Only try to join the sender's voice channel if they are in one themselves
            if (message.member.voice.channel) {
              const connection = await message.member.voice.channel.join();
              console.log(`Connection au channel vocal "${message.member.voice.channel.name} -- ${message.member.voice.channel.id}", demmande de ${message.author.username}`)
              let live = ytdl('https://www.youtube.com/watch?v=9FjAo1SjoQs', {filter: "audio"})
              console.log('Création du flux youtube terminé, lecture.')
              dispatcher = connection.play(live);
              dispatcher.setVolume(volume);
              dispatcher_msg = message
              console.log('Demmande terminée.')
              dispatcher.on('finish', () => {
                dispatcher_msg.channel.send('Transmition terminée')
                dispatcher = require('./errdisp')
              });
              
            } else {
              message.reply('Tu as besoin de rejoindre un salon vocal!!!!!!!!!');
            }
         
     
    } else if (message.content.startsWith('.vol')) {
        let args = message.content.split(' ')
        let vol = args[1] / 100
      if (vol >= 0) {
        if (vol <= 1) {
          if (dispatcher.setVolume(vol, message) !== "no") {
          message.reply(`Le message a été modifié jusq'a ${args[1]}%`)}
          volume = args[1] / 100
        }else message.reply('Le volume doit se trouver entre 0 et 100. Exemple 50 pour 50%.')
      }else message.reply('Le volume doit se trouver entre 0 et 100. Exemple 50 pour 50%.')
    }else if (message.content === ".exit") {
        message.reply('initialisation du redemarage de "dispatcher"')
        dispatcher.destroy(message)
        dispatcher = require('./errdisp')
        message.reply('"dispatcher" redémaré.')
        console.log('Flux abandonné.')
    } else if (message.content.startsWith('.validate')) {
      let args = message.content.split(' ')
      if (ytdl.validateURL(args[1])) {
        message.channel.send(`L'url ${args[1]} est bien une vidéo youtube.`)
        let info = await ytdl.getInfo(args[1])
        let embed = new discord.MessageEmbed
        embed.setTitle(info.videoDetails.title)
          .addFields(
            {
              name:"Durée", value:`${info.videoDetails.lengthSeconds} secondes`
            },
            {
              name:"likes", value:info.videoDetails.likes
            },
            {
              name:"dislikes", value:info.videoDetails.dislikes
            }
          )
        message.channel.send({ embed: embed })
        embed = new discord.MessageEmbed
        embed.setTitle(info.videoDetails.title)
          .addFields(
            {
              name:"Chaine", value:`${info.videoDetails.author.name}`
            },
            {
              name:"Abonnées", value:info.videoDetails.author.subscriber_count
            }
          )
          .setColor('#FF0000')
        message.channel.send({ embed: embed })
      }
    }
    if (message.content.startsWith('.youtube')) {
      let args = message.content.split(' ')
      if (ytdl.validateURL(args[1])) {
        let stream = ytdl(args[1])
        startLive(message, args[1])
      } else if (ytdl.validateID(args[1])) {
        let url = ytdl.getURLVideoID(args[1])
        let stream = ytdl(url)
        startLive(message, url)
      } else message.reply(`Merci d'indiquer une URL youtube ou son l'ID.`)
    }
})

client.on('ready', () => {
    console.log('YOUPI')
})

async function startLive(messss, streamurl) {
  if (messss.member.voice.channel) {
    const connection = await messss.member.voice.channel.join();
    console.log(`Connection au channel vocal "${messss.member.voice.channel.name} -- ${messss.member.voice.channel.id}", demmande de ${messss.author.username}`)
    let live = ytdl(streamurl, {filter: "audio"})
    console.log('Création du flux youtube terminé, lecture.')
    dispatcher = connection.play(live);
    dispatcher.setVolume(volume);
    dispatcher_msg = messss
    console.log('Demmande terminée.')
    dispatcher.on('finish', () => {
      dispatcher_msg.channel.send('Transmition terminée')
      dispatcher = require('./errdisp')
    });
    
    
  } else {
    messss.reply('Tu as besoin de rejoindre un salon vocal!!!!!!!!!');
  }
}