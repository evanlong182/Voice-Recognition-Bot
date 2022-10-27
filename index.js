const java = require('java')
//const Discord = require('discord.js')
const config = require('./secret/config.json')
//const dontlook = require('./secret/dontlook.java')
//require('dotenv').config();
const { Client, Collection ,GatewayIntentBits, Events} = require('discord.js');
const fs = require('node:fs');
const path = require('node:path');




const discordClient = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
  ]
});
//const discordClient = new Discord.Client();

discordClient.on('ready', () => {
  console.log(`Logged in as ${discordClient.user.tag}!`)
})


discordClient.commands = new Collection();

const commandsPath = path.join(__dirname, 'commands');
console.log('commandsPath = ', commandsPath);
const commandFiles = fs.readdirSync(commandsPath).filter(file => file.endsWith('.js'));

for (const file of commandFiles) {
	const filePath = path.join(commandsPath, file);
	const command = require(filePath);
	// Set a new item in the Collection with the key as the command name and the value as the exported module
	if ('data' in command && 'execute' in command) {
    console.log('command name = ' + command.data.name + ' command = ' + command.data);
		discordClient.commands.set(command.data.name, command);
	} else {
		console.log(`[WARNING] The command at ${filePath} is missing a required "data" or "execute" property.`);
	}
}

discordClient.once(Events.ClientReady, () => {
	console.log('Ready!');
});

discordClient.on(Events.InteractionCreate, async interaction => {
	if (!interaction.isChatInputCommand()) return;

	const command = discordClient.commands.get(interaction.commandName);

	if (!command) return;

	try {
		await command.execute(interaction);
	} catch (error) {
		console.error(error);
		await interaction.reply({ content: 'There was an error while executing this command!', ephemeral: true });
	}
});



/*
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
    {
      console.log('shutdown yep');
      command = "shutdown";
    }
      
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
*/
  

/*
discordClient.on(Events.InteractionCreate, async interaction => {
  if (!interaction.isChatInputCommand())
    return;

  const { commandName } = interaction;

  if (commandName == 'ping') {
    await interaction.reply('pong');
  }
});
*/


discordClient.login(config.discordApiToken)