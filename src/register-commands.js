require('dotenv').config();
const { REST, Routes, ApplicationCommandOptionType} = require("discord.js");

const commands = [
    {
        name: "purge",
        description: "Löscht beliebig viele Nachrichten",
        options: 
        [
            {
                name: 'löschmenge',
                description: 'Anzahl der Löschungen?',
                type: ApplicationCommandOptionType.Integer,
                required: true
            },
            {
                name: 'user',
                description: 'Der Benutzer, dessen Nachrichten gelöscht werden sollen.',
                type: ApplicationCommandOptionType.User,
                required: false
            }
        ]
    },
]

const rest = new REST({ version: '10' }).setToken(process.env.TOKEN);

(async () => {
    try {
        console.log('Registering slash commands...');

        await rest.put(
            Routes.applicationGuildCommands(process.env.CLIENT_ID, process.env.GUILD_ID),
            { body: commands }
        )

        console.log('Slash commands were registered succesfully');
    } catch (error) {
        console.log(`There was an error: ${error}`);
    }
})();