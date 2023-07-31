require('dotenv').config();
const { Client, IntentsBitField } = require('discord.js');

const client = new Client({
  intents: [
    IntentsBitField.Flags.Guilds,
    IntentsBitField.Flags.GuildMembers,
    IntentsBitField.Flags.GuildMessages,
    IntentsBitField.Flags.MessageContent,
  ],
});

const trustedRole = 'Vertrauenswürdig';

function hasLink(message) {
  // Ein regulärer Ausdruck, der nach URLs sucht
  const urlRegex = /https?:\/\/[^\s]+/g;
  // Gib true zurück, wenn die Nachricht einen Link enthält, sonst false
  return urlRegex.test(message.content);
}

client.on('ready', (c) => {
  console.log(`✅ ${c.user.tag} is online.`);
});

// Registriere einen Listener für die Nachricht "messageCreate"
// Wenn der Bot eine Nachricht empfängt, führe diese Funktion aus
client.on('messageCreate', (message) => {
  // Wenn die Nachricht von einem Bot kommt, ignoriere sie
  if (message.author.bot) return;
  // Wenn die Nachricht einen Link enthält und der Autor nicht die Rolle Vertrauenswürdig hat, lösche die Nachricht und sende eine Warnung
  if (hasLink(message) && !message.member.roles.cache.some((role) => role.name === trustedRole)) {
    message.delete();
  }
});

client.on('interactionCreate', async (interaction) => {
  if (!interaction.isChatInputCommand()) return;

  if (interaction.commandName === 'purge') {
    if (!interaction.options.getInteger('löschmenge')) return;

    const löschmenge = interaction.options.getInteger('löschmenge');
    const user = interaction.options.getUser('user');

    let messagesToBeDeleted;

    if (user) {
        const messages = await interaction.channel.messages.fetch({ limit: löschmenge });
        messagesToBeDeleted = messages.filter(message => message.author && message.author.id === user.id);
    } else {
        messagesToBeDeleted = await interaction.channel.messages.fetch({ limit: löschmenge });
    }
    

    await interaction.channel.bulkDelete(messagesToBeDeleted, true).catch(error => {
        console.error(error);
        interaction.reply('Ein Fehler ist aufgetreten beim Löschen der Nachrichten.');
    });

  const reply = await interaction.reply(
    { 
    content: `${messagesToBeDeleted.size} Nachrichten wurden gelöscht.`,
    fetchReply: true 
    }
    );
  setTimeout(() => reply.delete(), 1000);
  

  }
})

client.login(process.env.TOKEN);