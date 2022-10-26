const Discord = require('discord.js')
const config = require('./config')
const dontlook = require('./dontlook')


const discordClient = new Discord.Client()

discordClient.on('ready', () => {
  console.log(`Logged in as ${discordClient.user.tag}!`)
})

discordClient.login(config.discordApiToken)



discordClient.on('presenceUpdate', async (oldPresence, newPresence) => {
    console.log('New Presence:', newPresence)
  
    const member = newPresence.member
    const presence = newPresence
    const memberVoiceChannel = member.voice.channel
  
    if (!presence || !presence.activity || !presence.activity.name || !memberVoiceChannel) {
      return
    }
  
    const connection = await memberVoiceChannel.join()
  
    connection.on('speaking', (user, speaking) => {
      if (speaking) {
        console.log(`I'm listening to ${user.username}`)
      } else {
        console.log(`I stopped listening to ${user.username}`)
      }
    })
  })

  discordClient.on('message', message => {
    if (message.channel.type != 'text' || message.author.bot)
      return;
  
    var command = "N/A";
    if (message.content == "!shutdown")
      command = "shutdown";
    //let command = message.content.split(' ')[0].slice(1);
    if (message.content == "!restart")
      command = "restart";
    //let args = message.content.replace('.' + command, '').trim();
    let isBotOwner = message.author.id == config.authorid;
  
    switch (command) {
      case 'restart': {
        if (!isBotOwner)
          return;
  
        message.channel.send('Restarting...').then(m => {
          discordClient.destroy().then(() => {
            discordClient.login('token');
          });
        });
        break;
      }
  
  
      case 'shutdown': {
        if (!isBotOwner)
          return;
  
        message.channel.send('Shutting down...').then(m => {
          discordClient.destroy();
          process.exit();
        });
        break;
      }
    }
  });