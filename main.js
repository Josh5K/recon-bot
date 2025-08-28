import 'dotenv/config';
import { Client, GatewayIntentBits, Partials, EmbedBuilder } from 'discord.js';
import { joinVoiceChannel, getVoiceConnection } from '@discordjs/voice';
import fs from 'fs';
import { isRateLimited } from './helpers/rateLimiter.js';

// Commands
import { joke } from './commands/joke.js';
import { says } from './commands/says.js';
import { blame } from './commands/blame.js';
import { tell } from './commands/tell.js';
import { updatePrompt, listPrompts, deleteContext, addContext } from './commands/prompt.js';
import { getCurrentVersionChangelog } from './helpers/changelog.js';

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildVoiceStates,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent,
    GatewayIntentBits.GuildMembers
  ],
  partials: [Partials.Channel, Partials.Message]
});

const TOKEN = process.env.DISCORD_TOKEN;
const packageJson = JSON.parse(fs.readFileSync('./package.json', 'utf8'));
const VERSION = packageJson.version;

client.once('ready', async () => {
  console.log(`Logged in as ${client.user.tag}!`);
  for (const guild of client.guilds.cache.values()) {
    const channel = guild.channels.cache.find(
      ch => ch.name === 'recon-says' && ch.isTextBased && ch.isTextBased()
    );

    if (channel) {
      try {
        const changelog = getCurrentVersionChangelog('./changelog.md', VERSION);
        if (changelog) {
          const lines = changelog.split('\n').filter(Boolean);
          const header = `Recon Says - v${VERSION}`;
          const updates = lines.slice(1).join('\n\n');
          const footer = `${process.env.CHANGELOG_FOOTER || `${client.user.username}`}`;
          const embed = new EmbedBuilder()
            .setAuthor({ name: header, iconURL: client.user.displayAvatarURL() })
            .setDescription(`# Recon bot - v${VERSION}\n ${updates}`)
            .setFooter({ text: footer })
            .setColor(0x00AE86)
            .setTimestamp();
          await channel.send({ embeds: [embed] });
        }
      } catch (err) {
        console.error('Failed to send changelog:', err);
      }
    }
  }
});

client.on('messageCreate', async (message) => {
  if(!message.author.bot) {
    messageHandler(message)
  }
})

const commandRegistry = [];
function registerCommand(prefix, handler, rateLimit = false) {
  commandRegistry.push({
    prefix,
    handler: async (message) => {
      if(rateLimit) {
        if(isRateLimited(message.author.id)) {
          return message.reply("You have reached the hourly limit (15 per hour). Please try again later.");
        }
      }
      await handler(message, prefix);
      await moveMessage(message);
    }
  });
}

registerCommand('recon tell me a joke', joke);
registerCommand('recon says', says, true);
registerCommand('roll for blame', blame);
registerCommand('recon ask', tell, true);
registerCommand('recon update prompt', updatePrompt);
registerCommand('recon list prompts', listPrompts);
registerCommand('recon delete context', deleteContext);
registerCommand('recon add context', addContext);

function messageHandler(message) {
  console.log(`Message received: ${message.content} from ${message.author.username}`);
  const content = message.content.toLowerCase();
  for (const cmd of commandRegistry) {
    if (content.startsWith(cmd.prefix)) {
      cmd.handler(message, cmd.prefix);
      break;
    }
  }
}

let getConnection = async (channel) => {
  let connection = await getVoiceConnection(channel.guild.id);
  if(!connection) {
      connection = await joinVoiceChannel({
          channelId: channel.id,
          guildId: channel.guild.id,
          adapterCreator: channel.guild.voiceAdapterCreator,
          selfDeaf: false
      });

      // Check every 5 seconds if the channel is empty if so disconnect
      let activityCheck = setInterval( () => {
        if(channel.members.size <= 1) {
          connection.disconnect()
          clearInterval(activityCheck);
        }
      }, 5000)
  }
  return connection;
}

let getChannel = async (message) => {
  let channel = await message.member.voice.channel;
  if (!channel) {
    message.reply('I have no idea where you are! Try joining a voice channel first.');
  }
  return channel
}

let moveMessage = async (message) => {
  let targetChannel = message.guild.channels.cache.find(channel => channel.name === "recon-says");
  if(targetChannel) {
    try {
      const embed = new EmbedBuilder()
        .setAuthor({ name: message.member.displayName || message.author.username, iconURL: message.author.displayAvatarURL() })
        .setDescription(message.content.trim())
        .setTimestamp(message.createdAt)
        .setFooter({ text: `Moved from #${message.channel.name}` });
      await targetChannel.send({ embeds: [embed] });
    }
    catch(err) {
      console.log(`Unable to move message: ${err}`)
    }
  }
  else {
    console.log('Target channel not found');
  }
}

client.login(TOKEN);

// TODO: Move this to their own helper files
export { getChannel, getConnection }