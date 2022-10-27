const { REST, Routes } = require('discord.js');
const { clientId, guildId, discordApiToken } = require('.secret/config.json');

const commands = [];

const rest = new REST({ version: '10' }).setToken(discordApiToken);

rest.put(Routes.applicationGuildCommands(clientId, guildId), { body: commands })
	.then(data => console.log(`Successfully registered ${data.length} application commands.`))
	.catch(console.error);